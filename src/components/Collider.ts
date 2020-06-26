import type { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
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

  static componentName: 'collider' = 'collider';

  shape: TCollider;
  threadData: Array<vec3>;
  type: COLLIDER_TYPE;

  constructor(type: COLLIDER_TYPE, ...params: Array<vec3>) {
    this.threadData = params;
    this.type = type;
  }
}


/**
 * Component to specify object shape to detect collisions
 * @param {COLLIDER_TYPE} type type of the shape to detect collisions
 * @param {Array<vec3>} params params to collider shape constructor.
 */
export const ColliderComponent = ({
  type, params,
}: {
  type: COLLIDER_TYPE, params?: Array<vec3>,
}) =>
  new Collider(type, ...params);
