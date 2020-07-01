import type { GameEvent, GAME_EVENT_TYPE } from '../GameEvent/GameEvent';
import type { Thread, THREAD_ID } from '../Thread';
import type { Entity } from './Entity';
import type { System } from './System';
import type { transform } from './EntityManager';
import { Component } from './Component';
import EventObservable from '../GameEvent/EventObservable';
import { EntityManager, EntitySelector } from './EntityManager';
import { MemoryManager } from './MemoryManager';
import { THREAD_PHYSICS } from '../../src/Thread/threadConstants';

type SerializedComponent = {
  type: string;
  data: [Entity, Component][];
};

type ComponentStatics = Readonly<{
  threadsConstructors: (ComponentStatics) => void;
}>;

// declare class ComponentWithStatics<T extends string> {
//   // static threadsConstructors: (component: ComponentWithStatics<T>) => string;
//   static componentName: T;
//   // static networkable?: boolean;
// }

type ObjectConstructor = (any) => Component;

export class World {
  constructors: Map<string, ObjectConstructor> = new Map();
  components: Map<string, Map<string, Component>> = new Map();
  entities: Set<Entity> = new Set();
  systems: System[] = [];
  threads: Thread[] = [];
  threadsMap: Map<number, Thread> = new Map();
  componentTypes: Map<string, Class<Component> & ComponentStatics> = new Map();
  selectors: EntitySelector<ReadonlyArray<typeof Component>>[] = [];
  eventsForThreads: GameEvent[] = [];
  events: EventObservable<GameEvent> = new EventObservable();
  listeners: Array<(event: GameEvent) => void> = [];
  thread: THREAD_ID;
  lastAddedObjects = [];
  lastDeletedObjects = [];
  objects: Map<Entity, any> = new Map();
  memoryManager: MemoryManager = new MemoryManager();
  constructor(thread: THREAD_ID) {
    this.thread = thread;
  }

  registerThread(thread: Thread): void {
    this.threads.push(thread);
    this.threadsMap.set(thread.id, thread);
    if (thread.id === THREAD_PHYSICS)
      thread.postMessage({ type: 'dataArray', payload: this.memoryManager.memory });

    thread.events.subscribe(({ type, payload }) => {
      if (type === 'CREATE_ENTITY') {
        this.addExistedEntity(payload.id, ...payload.components);
      } else if (type === 'UPDATE_COMPONENTS') {
        if (payload.events && payload.events.length) {
          for (let i = 0; i < payload.events.length; i += 1) {
            this.events.emit(payload.events[i]);
          }
        }
      } else if (type === 'dataArray') {
        this.memoryManager.memory = payload;
      }
    });
  }

  registerComponentTypes(...componentTypes: Function[]): void {
    for (const componentType of componentTypes) {
      componentType.memoryManager = this.memoryManager;
      this.componentTypes.set(componentType.name, componentType);
      this.components.set(componentType.name, new Map());
    }
  }

  registerSystem(...systems: System[]): void {
    for (const system of systems) {
      this.systems.push(system);
    }
  }

  createSelector: transform = <T extends ReadonlyArray<Class<Component>>>(
    includeComponents: T,
    excludeComponents?: Class<Component>[],
  ) => {
    const selector = new EntitySelector(this, includeComponents, excludeComponents);
    this.selectors.push(selector);
    return selector.components;
  };

  update(delta: number): void {
    for (const system of this.systems) {
      system(delta / 1000);
    }
    for (const thread of this.threads) {
      thread.postMessage({
        type: 'UPDATE_COMPONENTS',
        payload: {
          delta,
          events: this.eventsForThreads,
        },
      });
    }
    // TODO: clear events queues in systems automatically after system updates
    this.eventsForThreads = [];
  }

  updateComponents(components: Array<SerializedComponent>): void {
    for (const component of components) {
      const componentRegistry = this.components.get(component.type);
      for (const [key, data] of component.data) {
        const componentForUpdate = componentRegistry.get(key);
        if (componentForUpdate) {
          Object.assign(componentForUpdate, data);
          // console.log(componentForUpdate, data)
        }
      }
    }
  }

  registerEntity(entityId: Entity, components: SerializedComponent[]): void {
    for (const component of components) {
      const componentRegistry = this.components.get(component.type);
      componentRegistry.set(entityId, component.data);
    }
    const componentMap = new Map(components.map(({ type, data }) => [type, data]));
    for (const selector of this.selectors) {
      if (
        !selector.includeComponents.find(
          (componentType) => !componentMap.has(componentType.name),
        ) &&
        !selector.excludeComponents.find((componentType) => componentMap.has(componentType.name))
      ) {
        const selectedComponents = {
          id: entityId,
        };
        for (let i = 0; i < selector.includeComponents.length; i += 1) {
          const component = componentMap.get(selector.includeComponents[i].name);
          selectedComponents[selector.includeComponents[i].componentName] = component;
        }
        selector.components.push(selectedComponents);
      }
    }
    this.entities.add(entityId);
  }

  addExistedEntity(id: Entity, ...components: SerializedComponent[]): void {
    for (const component of components) {
      const constructor = this.componentTypes.get(component.type);
      if (!component.data.offset) {
        component.data = Object.assign(Reflect.construct(constructor, []), component.data);
      } else {
        this.memoryManager.useAlocatedMemory(component.data.offset);
        component.data = Reflect.construct(constructor, [component.data]);
      }
      const threadConstructor =
        constructor.threadsConstructors && constructor.threadsConstructors[this.thread];
      if (threadConstructor) {
        threadConstructor(component.data);
      }
    }
    this.registerEntity(id, components);
  }

  createEntity<T extends Component[]>(
    id: Entity | null,
    ...components: T
  ): $Call<transform, $TupleMap<T, <TT>(TT) => Class<TT>>> {
    const createComponentInstance = (component) => {
      const offset = this.memoryManager.allocate(component.type);
      component.props.offset = offset;
      return new component.type(component.props);
    };
    const entityId = id !== null ? id : EntityManager.generateId();
    components = components.map((el) => (el.type ? createComponentInstance(el) || el : el));
    for (const thread of this.threads) {
      const componentsToAdd = components
        .filter((el) => el.constructor.threads.includes(thread.id))
        .map((el) => ({ type: el.constructor.name, data: el }));
      thread.postMessage({
        type: 'CREATE_ENTITY',
        payload: { id: entityId, components: componentsToAdd },
      });
    }
    this.registerEntity(
      entityId,
      components.map((el) => ({ type: el.constructor.name, data: el })),
    );
    const selectedComponents = {
      id: entityId,
      children: [],
    };
    const selectedComponentsNetworkable = {
      id: entityId,
      children: [],
    };
    this.objects.set(entityId, selectedComponents);
    for (let i = 0; i < components.length; i += 1) {
      const component: ComponentWithStatics<string> = components[i];
      selectedComponents[component.constructor.componentName] = component;
      if (component.constructor.networkable === true) {
        selectedComponentsNetworkable[component.constructor.componentName] = component;
      }
    }
    this.lastAddedObjects.push(selectedComponentsNetworkable);
    return selectedComponents;
  }

  deleteEntity(id: Entity, dispatchable = true): void {
    for (const registry of this.components.values()) {
      const component = registry.get(id);
      if (component) {
        if (component.destructor) component.destructor();
        registry.delete(id);
      }
    }
    for (const selector of this.selectors) {
      const index = selector.components.findIndex((el) => el.id === id);
      if (index !== -1) {
        selector.components.splice(index, 1); // TODO: seems like it should be linked list with pool
      }
    }
    if (dispatchable) {
      this.lastDeletedObjects.push(id);
    }
    const object = this.objects.get(id);
    if (!object) {
      return;
    }
    this.objects.delete(id);

    for (let index = 0; index < object.children.length; index += 1) {
      this.deleteEntity(object.children[index].id, false);
    }
  }

  dispatch(gameEvent: GameEvent): void {
    this.eventsForThreads.push(gameEvent);
    this.events.emit(gameEvent);
  }

  createEventAndDispatch<T>(type: GAME_EVENT_TYPE, payload?: T, network?: boolean): void {
    this.dispatch({ type, payload, network });
  }

  registerConstructor(name: string, constructor: ObjectConstructor): void {
    this.constructors.set(name, (params) => !this.entities.has(params.id) && constructor(params));
  }
}
