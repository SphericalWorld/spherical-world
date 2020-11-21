import type { Thread, THREAD_ID } from '../Thread';
import type { Entity } from './Entity';
import type { System } from './System';
import type { transform } from './EntityManager';
import { Component } from './Component';
import EventObservable from '../GameEvent/EventObservable';
import { EntityManager, EntitySelector } from './EntityManager';
import { MemoryManager } from './MemoryManager';
import { THREAD_PHYSICS, THREAD_MAIN } from '../../src/Thread/threadConstants';

type SerializedComponent = {
  type: string;
  data: [Entity, Component][];
};

type SerializedComponent2 = {
  type: string;
  data: Component;
};

// declare class ComponentWithStatics<T extends string> {
//   // static threadsConstructors: (component: ComponentWithStatics<T>) => string;
//   static componentName: T;
//   static networkable?: boolean;
// }

type ObjectConstructor = (any) => Component;

export class World<Events = unknown> {
  constructors: Map<string, ObjectConstructor> = new Map();
  components: Map<string, Map<string, Component>> = new Map();
  entities: Set<Entity> = new Set();
  systems: System[] = [];
  threads: Thread[] = [];
  threadsMap: Map<number, Thread> = new Map();
  componentTypes: Map<string, typeof Component> = new Map();
  selectors: EntitySelector<ReadonlyArray<typeof Component>>[] = [];
  eventsForThreads: Events[] = [];
  events: EventObservable<Events> = new EventObservable();
  networkQueue = [];
  listeners: Array<(event: Events) => void> = [];
  thread: THREAD_ID;
  lastAddedObjects = [];
  lastDeletedObjects: string[] = [];
  objects: Map<Entity, any> = new Map();
  memoryManager: MemoryManager = new MemoryManager();
  interthreadDescriptors: SharedArrayBuffer = new SharedArrayBuffer(8);
  interthreadDescriptors2: SharedArrayBuffer = new SharedArrayBuffer(4);
  pseudoSyncTimer = 0;
  private threadTicker: Float64Array = new Float64Array(this.interthreadDescriptors, 0, 1);
  private mutexes: Int32Array = new Int32Array(this.interthreadDescriptors2, 0, 1);

  constructor(thread: THREAD_ID) {
    this.thread = thread;
  }

  registerThread(thread: Thread): void {
    this.threads.push(thread);
    this.threadsMap.set(thread.id, thread);
    if (thread.id === THREAD_PHYSICS)
      thread.postMessage({
        type: 'dataArray',
        payload: {
          memory: this.memoryManager.memory,
          interthreadDescriptors: this.interthreadDescriptors,
          interthreadDescriptors2: this.interthreadDescriptors2,
        },
      });

    thread.events.subscribe(({ type, payload }) => {
      if (type === 'CREATE_ENTITY') {
        this.addExistedEntity(payload.id, ...payload.components);
      } else if (type === 'UPDATE_COMPONENTS') {
        if (payload.events && payload.events.length) {
          for (let i = 0; i < payload.events.length; i += 1) {
            this.events.emit(payload.events[i]);
          }
          // if (this.thread === 1) console.log(payload.events);
        }
      } else if (type === 'dataArray') {
        this.interthreadDescriptors = payload.interthreadDescriptors;
        this.interthreadDescriptors2 = payload.interthreadDescriptors2;
        this.memoryManager.useMemory(payload.memory);
        this.threadTicker = new Float64Array(this.interthreadDescriptors, 0, 1);
        this.mutexes = new Int32Array(this.interthreadDescriptors2, 0, 1);
        this.startGameLoopInThread();
      } else if (type === 'START_PSEUDO_SYNC_TIMER') {
        this.pseudoSyncTimer = setInterval(() => this.update(1000 / 60), 1000 / 60);
      } else if (type === 'STOP_PSEUDO_SYNC_TIMER') {
        clearInterval(this.pseudoSyncTimer);
      }
    });
  }

  registerComponentTypes(...componentTypes: typeof Component[]): void {
    Component.memoryManager = this.memoryManager;
    for (const componentType of componentTypes) {
      componentType.memoryManager = this.memoryManager;
      this.componentTypes.set(componentType.componentName, componentType);
      this.components.set(componentType.componentName, new Map());
      this.memoryManager.registerComponentType(componentType);
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
    if (this.thread === THREAD_MAIN) {
      this.syncThreads(delta);
    }
    if (!this.eventsForThreads.length) return;

    // console.log(this.eventsForThreads);
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
          componentForUpdate.update(data);
        }
      }
    }
  }

  registerEntity(entityId: Entity, components: SerializedComponent2[]): void {
    for (const component of components) {
      const componentRegistry = this.components.get(component.type);
      componentRegistry.set(entityId, component.data);
    }
    const componentMap = new Map(components.map(({ type, data }) => [type, data]));
    for (const selector of this.selectors) {
      if (
        !selector.includeComponents.find(
          (componentType) => !componentMap.has(componentType.componentName),
        ) &&
        !selector.excludeComponents.find((componentType) =>
          componentMap.has(componentType.componentName),
        )
      ) {
        const selectedComponents = {
          id: entityId,
        };
        for (let i = 0; i < selector.includeComponents.length; i += 1) {
          const component = componentMap.get(selector.includeComponents[i].componentName);
          if (selector.includeComponents[i].componentName === 'script') {
            component.setGameObject(componentMap);
            component.start(this);
          }

          selectedComponents[selector.includeComponents[i].componentName] = component;
        }
        selector.components.push(selectedComponents);
      }
    }
    this.entities.add(entityId);
  }

  addExistedEntity(id: Entity, ...components: SerializedComponent2[]): void {
    for (const component of components) {
      const constructor = this.componentTypes.get(component.type);
      if (!constructor)
        throw new Error(
          `constructor for component ${component.type} is not registered in ${this.thread}`,
        );
      if (!component.data.offset) {
        component.data = Object.assign(
          Reflect.construct(constructor, [component.data]),
          component.data,
        );
      } else {
        this.memoryManager.useAlocatedMemory(component.data.offset, constructor);
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

  createEntity<T extends Component[]>(id: Entity | null, ...components: T): ReturnType<transform> {
    const createComponentInstance = (component) => {
      const offset = this.memoryManager.allocate(component.type);
      const res = new component.type(component.props);
      if (res.offset !== null) res.offset = offset;
      return res;
    };
    const entityId = id !== null ? id : EntityManager.generateId();
    components = components.map((el) => (el.type ? createComponentInstance(el) || el : el));
    for (const thread of this.threads) {
      const componentsToAdd = components
        .filter((el) => el.constructor.threads.includes(thread.id))
        .map((el) => ({ type: el.constructor.componentName, data: el }));
      thread.postMessage({
        type: 'CREATE_ENTITY',
        payload: { id: entityId, components: componentsToAdd },
      });
    }
    this.registerEntity(
      entityId,
      components.map((el) => ({ type: el.constructor.componentName, data: el })),
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

  dispatch(gameEvent: Events): void {
    const { uiEvent, ...eventForThread } = gameEvent;
    this.eventsForThreads.push(eventForThread);
    this.events.emit(gameEvent);
  }

  registerConstructor(name: string, constructor: ObjectConstructor): void {
    this.constructors.set(name, (params) => !this.entities.has(params.id) && constructor(params));
  }

  startGameLoopInThread(): void {
    // eslint-disable-next-line no-constant-condition
    setTimeout(() => {
      Atomics.wait(this.mutexes, 0, 0);
      const delta = this.threadTicker[0];
      this.threadTicker[0] = 0;
      this.update(delta);
      this.startGameLoopInThread();
    }, 0);
  }

  syncThreads(delta: number): void {
    this.threadTicker[0] += delta;
    Atomics.notify(this.mutexes, 0);
  }

  startPseudoSyncTimer(): void {
    for (const thread of this.threads) {
      thread.postMessage({
        type: 'START_PSEUDO_SYNC_TIMER',
      });
    }
  }

  stopPseudoSyncTimer(): void {
    for (const thread of this.threads) {
      thread.postMessage({
        type: 'STOP_PSEUDO_SYNC_TIMER',
      });
    }
  }

  pushToNetworkQueue(data): void {
    this.networkQueue.push(data);
  }
}
