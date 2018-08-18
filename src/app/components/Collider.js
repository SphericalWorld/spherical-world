// @flow
import type { Vec3 } from 'gl-matrix';
import type { Component } from './Component';
import type { Collider as TCollider, COLLIDER_TYPE } from '../physicsThread/physics/Collider';
import { createAABB } from '../physicsThread/physics/colliders/AABB';
import { THREAD_PHYSICS } from '../Thread/threadConstants';

const colliderShapes = [
  createAABB,
];

export default class Collider implements Component {
  static threads = [THREAD_PHYSICS];
  static threadsConstructors = {
    [THREAD_PHYSICS]: (obj: Collider) => {
      obj.shape = colliderShapes[obj.type](...obj.threadData);
    },
  };

  static componentName = 'collider';
  static componentType: { 'collider': Collider };

  shape: TCollider;
  threadData: Array<any>;
  type: COLLIDER_TYPE;

  constructor(type: COLLIDER_TYPE, ...params: Array<Vec3>) {
    this.threadData = params;
    this.type = type;
  }
}
