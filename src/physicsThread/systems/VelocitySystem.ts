import { vec3 } from 'gl-matrix';
import type { System } from '../../../common/ecs/System';
import { Transform, UserControlled, Velocity } from '../../components';
import type { WorldPhysicsThread } from '../../Events';

export default (ecs: WorldPhysicsThread): System => {
  const components = ecs.createSelector([Transform, Velocity], [UserControlled]);
  const controlledComponents = ecs.createSelector([Transform, Velocity, UserControlled]);

  const velocitySystem = (delta: number) => {
    for (const { transform, velocity } of components) {
      vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
    }
    for (const { transform, velocity, userControlled } of controlledComponents) {
      vec3.scaleAndAdd(
        transform.translation,
        transform.translation,
        userControlled.velocity,
        delta,
      );
      vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
    }
  };
  return velocitySystem;
};
