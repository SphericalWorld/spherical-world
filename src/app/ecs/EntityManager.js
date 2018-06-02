// @flow
import uuid from 'uuid/v1';
import type { Entity } from './Entity';
import type World from './World';
import { Component } from '../components/Component';

type SelectorFunction = (Entity) => boolean;

export class EntitySelector {
  includeComponents: Function[];
  excludeComponents: Function[];
  selectorFunction: SelectorFunction;
  components: Component[] = [];

  constructor(world: World, includeComponents: Function[], excludeComponents: Function[] = []) {
    this.includeComponents = includeComponents;
    this.excludeComponents = excludeComponents;
  }
}

export class EntityManager {
  static generateId(): string {
    return uuid();
  }
}
