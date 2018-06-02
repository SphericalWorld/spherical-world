// @flow
import { vec3 } from 'gl-matrix';
import type { System } from '../../systems/System';
import type { World } from '../../ecs';
import Transform from '../../components/Transform';
import Velocity from '../../components/Velocity';

const velocitySystemProvider = (ecs: World) => {
  class VelocitySystem implements System {
    world: World;
    components: [string, Transform, Velocity][] = ecs.createSelector([Transform, Velocity]);

    update(delta: number): Array {
      const result = [];
      for (const [id, transform, velocity] of this.components) {
        vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
        result.push([id, transform]);
      }

      return result;
    }
  }

  return VelocitySystem;
};

export default velocitySystemProvider;
