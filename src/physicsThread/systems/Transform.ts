import { vec3 } from 'gl-matrix';
import type { System } from '../../../common/ecs/System';
import { Transform, UserControlled } from '../../components';
import type { WorldPhysicsThread } from '../../Events';

export default (ecs: WorldPhysicsThread): System => {
  const components = ecs.createSelector([Transform], [UserControlled]);

  const transformSystem = (delta: number) => {
    for (const { transform } of components) {
      // console.log(transform.translationNext);
      vec3.scaleAndAdd(
        transform.translation,
        transform.translation,
        transform.translationNext,
        delta * 3,
      );
    }
  };
  return transformSystem;
};
