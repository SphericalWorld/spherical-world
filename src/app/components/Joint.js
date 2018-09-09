// @flow
import type { Entity } from '../../../common/ecs/Entity';
import type Transform from './Transform';
import { Component } from '../../../common/ecs/Component';
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
