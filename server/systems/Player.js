// @flow strict
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';

import { Transform, Network } from '../components/index';

export default (world: World, server: Server): System => {
  const players = world.createSelector([Transform, Network]);

  const playerSystem = (delta: number) => {
    // for (const { network, id } of players) {
    //   console.log(id)
    // }
  };
  return playerSystem;
};
