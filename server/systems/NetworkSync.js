// @flow strict
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import { send } from '../network/socket';
import { Transform, Network, Inventory } from '../components/index';

const getComponentsToUpdate = (world, playerId) => [...world.changedData.entries()]
  .filter(([constructor]) => constructor.networkable)
  .map(([constructor, data]) => (constructor.name === 'Transform'
    ? ({ type: constructor.name, data: [...data.entries()].filter(([id]) => id !== playerId) })
    : ({ type: constructor.name, data: [...data.entries()] })));

export default (world: World, server: Server): System => {
  const players = world.createSelector([Transform, Network, Inventory]);

  const networkSystem = (delta: number) => {
    for (const { network, id, transform } of players) {
      send(network.socket, 'SYNC_GAME_DATA', {
        components: getComponentsToUpdate(world, id),
        newObjects: world.lastAddedObjects.filter(el => el.networkSync),
        deletedObjects: world.lastDeletedObjects,
      });

      const [x,, z] = transform.translation;

      const chunkX = Math.floor(x / 16) * 16;
      const chunkZ = Math.floor(z / 16) * 16;

      const chunkXold = transform.chunkX || chunkX;
      const chunkZold = transform.chunkZ || chunkZ;

      if (chunkX < chunkXold) {
        for (let i = -8; i < 8; i += 1) {
          server.terrain.sendChunk({ socket: network.socket }, chunkX - (7 * 16), chunkZ + (i * 16));
        }
      } else if (chunkX > chunkXold) {
        for (let i = -8; i < 8; i += 1) {
          server.terrain.sendChunk({ socket: network.socket }, chunkX + (6 * 16), chunkZ + (i * 16));
        }
      }
      if (chunkZ < chunkZold) {
        for (let i = -8; i < 8; i += 1) {
          server.terrain.sendChunk({ socket: network.socket }, chunkX + (i * 16), chunkZ - (7 * 16));
        }
      } else if (chunkZ > chunkZold) {
        for (let i = -8; i < 8; i += 1) {
          server.terrain.sendChunk({ socket: network.socket }, chunkX + (i * 16), chunkZ + (6 * 16));
        }
      }
      transform.chunkX = chunkX;
      transform.chunkZ = chunkZ;
    }
    world.lastAddedObjects = [];
    world.lastDeletedObjects = [];
  };
  return networkSystem;
};
