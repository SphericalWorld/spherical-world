// @flow
import type { Entity } from '../ecs/Entity';
import type Transform from './Transform';
import { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Joint implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'joint' = 'joint';
  static componentType: { 'joint': Joint };

  parent: Entity;
  parentTransform: Transform;

  constructor(parent: Entity) {
    this.parent = parent;
  }
}
