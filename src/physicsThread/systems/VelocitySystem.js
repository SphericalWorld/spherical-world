// @flow strict
import { vec3 } from 'gl-matrix';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import Transform from '../../components/Transform';
import UserControlled from '../../components/UserControlled';
import Velocity from '../../components/Velocity';

export default (ecs: World): System => {
  const components = ecs.createSelector([Transform, Velocity], [UserControlled]);
  const controlledComponents = ecs.createSelector([Transform, Velocity, UserControlled]);

  const velocitySystem = (delta: number) => {
    const result = [];
    for (const { id, transform, velocity } of components) {
      vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
      result.push([id, transform]);
    }
    for (const {
      id, transform, velocity, userControlled,
    } of controlledComponents) {
      vec3.scaleAndAdd(transform.translation, transform.translation, userControlled.velocity, delta);
      vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);

      result.push([id, transform]);
    }

    return result;
  };
  return velocitySystem;
};
