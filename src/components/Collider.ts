import type { vec3 } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import type { Collider as TCollider, COLLIDER_TYPE } from '../physicsThread/physics/Collider';
import { createAABB } from '../physicsThread/physics/colliders/AABB';
import { THREAD_PHYSICS } from '../Thread/threadConstants';

const colliderShapes = [createAABB];

/**
 * Component to specify object shape to detect collisions
 * @param {COLLIDER_TYPE} type type of the shape to detect collisions
 * @param {Array<vec3>} params params to collider shape constructor.
 */
export class Collider extends Component<{
  type: COLLIDER_TYPE;
  params?: Array<vec3>;
}> {
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

  constructor({ type, params }: { type: COLLIDER_TYPE; params: Array<vec3> }) {
    super();
    this.threadData = params;
    this.type = type;
  }
}
