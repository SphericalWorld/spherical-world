// @flow
import type GameEvent from '../GameEvent/GameEvent';
import type { Input } from '../Input/Input';
import type { Entity } from './Entity';
import type { System } from '../systems/System';
import { Component } from '../components/Component';
import { EntityManager, EntitySelector } from './EntityManager';

export default class World {
  components: Map<string, Map<string, Component>> = new Map();
  systems: System[] = [];
  threads: Map<number, Worker> = new Map();
  componentTypes: Map<string, Function> = new Map();
  selectors: EntitySelector[] = [];
  input: Input;
  events: GameEvent[] = [];
  listeners: Array<GameEvent => void> = [];

  registerThread(id: number, thread: Worker) {
    this.threads.set(id, thread);
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
      system.world = this;
    }
  }

  createSelector(
    includeComponents: Component[],
    excludeComponents?: Component[],
  ): (Object[]) {
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

    for (const [threadId, thread] of this.threads.entries()) {
      const componentsToUpdate = [...changedData.entries()]
        .filter(([component]) => component.constructor.threads.includes(threadId))
        .map(([component, data]) => ({ type: component.constructor.name, data: [...data.entries()] }));
      thread.postMessage({
        type: 'UPDATE_COMPONENTS',
        payload: {
          components: componentsToUpdate,
          delta,
          events: this.events,
        },
      });
    }
    this.events = [];
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
      component.data = Object.assign(Reflect.construct(this.componentTypes.get(component.type), []), component.data);
    }
    this.registerEntity(id, components);
  }

  createEntity(id: Entity | null, ...components: Component[]): Entity {
    const entityId = id || EntityManager.generateId();
    for (const [threadId, thread] of this.threads.entries()) {
      const componentsToAdd = components
        .filter(el => el.constructor.threads.includes(threadId))
        .map(el => ({ type: el.constructor.name, data: el }));
      thread.postMessage({ type: 'CREATE_ENTITY', payload: { id: entityId, components: componentsToAdd } });
    }
    this.registerEntity(entityId, components.map(el => ({ type: el.constructor.name, data: el })));
    return entityId;
  }

  emitEvent(gameEvent: GameEvent) {
    this.events.push(gameEvent);
    for (const listener of this.listeners) {
      listener(gameEvent);
    }
  }

  setInput(input: Input) {
    this.input = input;
    input.onDispatch((gameEvent: GameEvent) => this.emitEvent(gameEvent));
  }

  subscribe(listener: (GameEvent) => void) {
    this.listeners.push(listener);
  }
}
