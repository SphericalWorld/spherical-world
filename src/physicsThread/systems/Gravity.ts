import { getBlock } from '../../../common/terrain';
import { blocksInfo } from '../../blocks/blockInfo';
import Terrain from '../Terrain/Terrain';
import Transform from '../../components/Transform';
import type { System } from '../../../common/ecs/System';
import { World } from '../../../common/ecs';
import Gravity from '../../components/Gravity';
import Velocity from '../../components/Velocity';

export default (ecs: World, terrain: Terrain): System => {
  const components = ecs.createSelector([Gravity, Velocity, Transform]);

  const gravitySystem = (delta: number) => {
    for (const { velocity, transform } of components) {
      let acceleration = 9.81;
      const block = getBlock(terrain)(...transform.translation);
      if (block !== undefined) {
        acceleration *= blocksInfo[block].fallAcceleration;
        velocity.linear[1] -= acceleration * delta;
        if (velocity.linear[1] < blocksInfo[block].fallSpeedCap) {
          velocity.linear[1] = blocksInfo[block].fallSpeedCap;
        }
      }
    }
  };
  return gravitySystem;
};
