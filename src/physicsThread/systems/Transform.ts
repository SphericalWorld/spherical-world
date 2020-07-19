import { vec3 } from 'gl-matrix';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import Transform from '../../components/Transform';
import UserControlled from '../../components/UserControlled';

export default (ecs: World): System => {
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
