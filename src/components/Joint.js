// @flow strict
import { type Vec3, vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type Transform from './Transform';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Joint implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'joint' = 'joint';
  static componentType: {| 'joint': Joint |};

  parent: Entity;
  parentTransform: Transform;
  distance: Vec3;

  constructor(parent: Entity, distance: Vec3 = vec3.create()) {
    this.parent = parent;
    this.distance = distance;
  }
}

/**
 * Component which bounds its entity to parent entity and move together with parent
 * @param {Entity} parent entity to which Joint will be attached
 * @param {Vec3} distance position in ***parent*** coordinates, where Joint entity will be located.
 * Position of Joint will be sum of parent position and ***distance***
 */
export const JointComponent = ({ parent, distance }: {| parent: Entity, distance?: Vec3 |}) =>
  // $FlowFixMe
  new Joint(parent, distance);
