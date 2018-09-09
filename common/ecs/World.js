// @flow
import type { GameEvent, GAME_EVENT_TYPE } from '../GameEvent/GameEvent';
import type { Thread, THREAD_ID } from '../Thread';
import type { Entity } from './Entity';
import type { System } from './System';
import type { transform } from './EntityManager';
import { Component } from './Component';
import EventObservable from '../GameEvent/EventObservable';
import { EntityManager, EntitySelector } from './EntityManager';

type SerializedComponent = {
  type: string;
  data: Component;
};

export default class World {
  components: Map<string, Map<string, Component>> = new Map();
  systems: System[] = [];
  threads: Thread[] = [];
  threadsMap: Map<number, Thread> = new Map();
  componentTypes: Map<string, typeof Component> = new Map();
  selectors: EntitySelector<typeof Component[]>[] = [];
  eventsForThreads: GameEvent[] = [];
  events: EventObservable<GameEvent> = new EventObservable();
  listeners: Array<GameEvent => void> = [];
  thread: THREAD_ID;

  constructor(thread: THREAD_ID) {
    this.thread = thread;
  }

  registerThread(thread: Thread) {
    this.threads.push(thread);
    this.threadsMap.set(thread.id, thread);
    if (typeof window === 'undefined') {
      setInterval(() => this.update(1000 / 60), 1000 / 60);
    }
    thread.events.subscribe(({ type, payload }) => {
      if (type === 'CREATE_ENTITY') {
        this.addExistedEntity(payload.id, ...payload.components);
      } else if (type === 'UPDATE_COMPONENTS') {
        this.updateComponents(payload.components || []);
        // if (typeof window === 'undefined') {
        //   this.update(payload.delta);
        // }
        if (payload.events && payload.events.length) {
          for (let i = 0; i < payload.events.length; i += 1) {
            this.events.emit(payload.events[i]);
          }
        }
      }
    });
  }

  registerComponentTypes(...componentTypes: Function[]): void {
    for (const componentType of componentTypes) {
      this.componentTypes.set(componentType.name, componentType);
      this.components.set(componentType.name, new Map());
    }
  }

  registerSystem(...systems: System[]): void {
    for (const system of systems) {
      this.systems.push(system);
    }
  }

  createSelector<T: Component[]>(
    includeComponents: T,
    excludeComponents?: (typeof Component)[],
  ): $Call<transform, T>[] {
    const selector = new EntitySelector(this, includeComponents, excludeComponents);
    this.selectors.push(selector);
    return selector.components;
  }

  update(delta: number): void {
    const changedData = new Map();
    this.systems
      .map(system => system.update(delta / 1000))
      .filter(changedComponents => changedComponents)
      .forEach((changedComponents) => {
        for (const [id, ...components] of changedComponents) {
          for (const component of components) {
            let el = changedData.get(component);
            if (!el) {
              el = new Map();
              changedData.set(component, el);
            }
            el.set(id, component);
          }
        }
      });

    const changedDataArray = [...changedData.entries()];
    for (const thread of this.threads) {
      const componentsToUpdate = changedDataArray
        .filter(([component]) => component.constructor.threads.includes(thread.id))
        .map(([component, data]) => ({ type: component.constructor.name, data: [...data.entries()] }));
      thread.postMessage({
        type: 'UPDATE_COMPONENTS',
        payload: {
          components: componentsToUpdate,
          delta,
          events: this.eventsForThreads,
        },
      });
    }
    // TODO: clear events queues in systems automatically after system updates
    this.eventsForThreads = [];
  }

  updateComponents(components) {
    for (const component of components) {
      const componentRegistry = this.components.get(component.type);
      for (const [key, data] of component.data) {
        Object.assign(componentRegistry.get(key), data);
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
      if (!selector.includeComponents.find(componentType => !componentMap.has(componentType.name))
        && !selector.excludeComponents.find(componentType => componentMap.has(componentType.name))) {
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
  }

  addExistedEntity(id: Entity, ...components: SerializedComponent[]): void {
    for (const component of components) {
      const constructor = this.componentTypes.get(component.type);
      component.data = Object.assign(Reflect.construct(constructor, []), component.data);
      const threadConstructor = constructor.threadsConstructors && constructor.threadsConstructors[this.thread];
      if (threadConstructor) {
        threadConstructor(component.data);
      }
    }
    this.registerEntity(id, components);
  }

  createEntity(id: ?Entity, ...components: Component[]): Entity {
    const entityId = id || EntityManager.generateId();
    for (const thread of this.threads) {
      const componentsToAdd = components
        .filter(el => el.constructor.threads.includes(thread.id))
        .map(el => ({ type: el.constructor.name, data: el }));
      thread.postMessage({ type: 'CREATE_ENTITY', payload: { id: entityId, components: componentsToAdd } });
    }
    this.registerEntity(entityId, components.map(el => ({ type: el.constructor.name, data: el })));
    return entityId;
  }

  dispatch(gameEvent: GameEvent) {
    this.eventsForThreads.push(gameEvent);
    this.events.emit(gameEvent);
  }

  createEventAndDispatch<T>(type: GAME_EVENT_TYPE, payload?: T, network?: boolean) {
    this.dispatch({ type, payload, network });
  }
}
