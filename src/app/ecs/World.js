// @flow
import type { GameEvent } from '../GameEvent/GameEvent';
import type { Input } from '../Input/Input';
import type Thread from '../Thread/Thread';
import type { THREAD_ID } from '../Thread/threadConstants';
import type { Entity } from './Entity';
import type { System } from '../systems/System';
import type { transform } from './EntityManager';
import { Component } from '../components/Component';
import EventObservable from '../GameEvent/EventObservable';
import { EntityManager, EntitySelector } from './EntityManager';

export default class World {
  components: Map<string, Map<string, Component>> = new Map();
  systems: System[] = [];
  threads: Thread[] = [];
  threadsMap: Map<number, Thread> = new Map();
  componentTypes: Map<string, Function> = new Map();
  selectors: EntitySelector<Component>[] = [];
  input: Input;
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
    thread.events.subscribe(({ type, payload }) => {
      if (type === 'CREATE_ENTITY') {
        this.addExistedEntity(payload.id, ...payload.components);
      } else if (type === 'UPDATE_COMPONENTS') {
        this.updateComponents(payload.components || []);
        if (typeof window === 'undefined') {
          this.update(payload.delta);
        }
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
    excludeComponents?: Component[],
  ): $Call<transform, T>[] {
    const selector = new EntitySelector(this, includeComponents, excludeComponents);
    this.selectors.push(selector);
    return selector.components;
  }

  update(delta: number): void {
    const changedData = new Map();
    for (const system of this.systems) {
      const changedComponents = system.update(delta / 1000);
      if (changedComponents) {
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
      }
    }

    for (const thread of this.threads) {
      const componentsToUpdate = [...changedData.entries()]
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

  registerEntity(entityId: Entity, components: Component[]): void {
    for (const component of components) {
      const componentRegistry = this.components.get(component.type);
      componentRegistry.set(entityId, component.data);
    }
    const componentMap = components.reduce((map, el) => {
      map.set(el.type, el.data);
      return map;
    }, new Map());
    for (const selector of this.selectors) {
      if (!selector.includeComponents.find(componentType => !componentMap.has(componentType.name))
        && !selector.excludeComponents.find(componentType => componentMap.has(componentType.name))) {
        const components = {
          id: entityId,
        };
        for (let i = 0; i < selector.includeComponents.length; i += 1) {
          const component = componentMap.get(selector.includeComponents[i].name);
          components[selector.includeComponents[i].componentName] = component;
        }
        selector.components.push(components);
      }
    }
  }

  addExistedEntity(id: Entity, ...components: Component[]): void {
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

  createEntity(id: Entity | null, ...components: Component[]): Entity {
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

  setInput(input: Input) {
    this.input = input;
    input.onDispatch((gameEvent: GameEvent) => this.dispatch(gameEvent));
  }
}
