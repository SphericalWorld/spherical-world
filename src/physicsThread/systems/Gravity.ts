import { getBlock } from '../../../common/terrain';
import { blocksInfo } from '../../blocks/blocksInfoAllThreads';
import type Terrain from '../Terrain/Terrain';
import Transform from '../../components/Transform';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import Gravity from '../../components/Gravity';
import Velocity from '../../components/Velocity';

export default (ecs: World, terrain: Terrain): System => {
  const components = ecs.createSelector([Gravity, Velocity, Transform]);

  const gravitySystem = (delta: number) => {
    for (const { velocity, transform } of components) {
      let acceleration = 9.81;
      const block = getBlock(terrain)(
        transform.translation[0],
        transform.translation[1],
        transform.translation[2],
      );
      if (block !== undefined) {
        const { fallAcceleration, fallSpeedCap } = blocksInfo[block];
        acceleration *= fallAcceleration;
        velocity.linear[1] -= acceleration * delta;
        if (velocity.linear[1] < fallSpeedCap) {
          velocity.linear[1] = fallSpeedCap;
        }
      }
    }
  };
  return gravitySystem;
};
