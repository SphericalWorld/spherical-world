// @flow strict
import { type World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import {
  Transform, Network, Inventory, Camera,
} from '../components/index';
import { throttle } from '../../common/utils';
import { updateGameObject, type DataStorage } from '../dataStorage';

export default (world: World, server: Server, ds: DataStorage): System => {
  const players = world.createSelector([Transform, Network, Inventory, Camera]);
  const syncData = throttle(() => { updateGameObject(ds)(...players); }, 2000);

  const playerSystem = (delta: number) => {
    syncData();
    const res = [];
    for (const { id, transform } of players) {
      res.push([id, transform]);
    }
    return res;
  };
  return playerSystem;
};
