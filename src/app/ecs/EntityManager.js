// @flow
import uuid from 'uuid/v1';
import type { Entity } from './Entity';
import type World from './World';
import { Component } from '../components/Component';

type SelectorFunction = (Entity) => boolean;

export class EntitySelector<T> {
  includeComponents: T;
  excludeComponents: Component[];
  selectorFunction: SelectorFunction;
  components: {id: Entity, data: T}[] = [];

  constructor(world: World, includeComponents: T, excludeComponents: Component[] = []) {
    this.includeComponents = includeComponents;
    this.excludeComponents = excludeComponents;
  }
}

export class EntityManager {
  static generateId(): string {
    return uuid();
  }
}
