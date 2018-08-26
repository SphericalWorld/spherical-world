// @flow
import type { Entity } from '../../ecs/Entity';
import { Just } from '../../../../common/fp/monads/maybe';
import { getBlock } from '../../../../common/terrain';
import { blocksInfo } from '../../blocks/blockInfo';
import { Terrain } from '../Terrain/Terrain';
import Transform from '../../components/Transform';
import { System } from '../../systems/System';
import { World } from '../../ecs';
import Gravity from '../../components/Gravity';
import Velocity from '../../components/Velocity';

export default (ecs: World, terrain: Terrain) =>
  class GravitySystem implements System {
    components = ecs.createSelector([Gravity, Velocity, Transform]);

    update(delta: number): [Entity, ?Velocity][] {
      const result = [];
      for (const { id, velocity, transform } of this.components) {
        let acceleration = 9.81;
        getBlock(terrain)(...transform.translation)
          .alt(Just(0))
          .map((block) => {
            acceleration *= blocksInfo[block].fallAcceleration;
            velocity.linear[1] -= (acceleration * delta);
            if (velocity.linear[1] < blocksInfo[block].fallSpeedCap) {
              velocity.linear[1] = blocksInfo[block].fallSpeedCap;
            }
            result.push([id, velocity]);
          });
      }

      return result;
    }
  };
