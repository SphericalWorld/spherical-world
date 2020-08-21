import type { World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import { send } from '../network/socket';
import { Transform, Network, Inventory } from '../components';
import { throttle } from '../../common/utils';

const getComponentsToUpdate = (world: World, playerId: string) =>
  [...world.components.entries()]
    .map(([constructor, data]) => [world.componentTypes.get(constructor), data])
    .filter(([constructor]) => constructor.componentName === 'transform')
    .map(([constructor, data]) =>
      constructor.componentName === 'transform'
        ? {
            type: constructor.componentName,
            data: [...data.entries()]
              .filter(([id]) => id !== playerId)
              .map(([_, value]) => [_, value.serialize()]),
          }
        : { type: constructor.componentName, data: [...data.entries()] },
    );

const RENDER_DISTANCE = 8;
const VISIBILITY = RENDER_DISTANCE + 2; // 1 chunk around will have loaded lights but not vbo, and another 1 will have no lights loaded

// const calcPlayerMovement = (server: Server, transform: Transform, network) => {
//   const [x, , z] = transform.translation;

//   const chunkX = Math.floor(x / 16) * 16;
//   const chunkZ = Math.floor(z / 16) * 16;

//   const chunkXold: number = transform.chunkX ?? chunkX;
//   const chunkZold: number = transform.chunkZ ?? chunkZ;

//   if (chunkX < chunkXold) {
//     for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
//       server.terrain.sendChunk(
//         { socket: network.socket },
//         chunkX - (VISIBILITY - 1) * 16,
//         chunkZ + i * 16,
//       );
//     }
//   } else if (chunkX > chunkXold) {
//     for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
//       server.terrain.sendChunk(
//         { socket: network.socket },
//         chunkX + (VISIBILITY - 1) * 16,
//         chunkZ + i * 16,
//       );
//     }
//   }
//   if (chunkZ < chunkZold) {
//     for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
//       server.terrain.sendChunk(
//         { socket: network.socket },
//         chunkX + i * 16,
//         chunkZ - (VISIBILITY - 1) * 16,
//       );
//     }
//   } else if (chunkZ > chunkZold) {
//     for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
//       server.terrain.sendChunk(
//         { socket: network.socket },
//         chunkX + i * 16,
//         chunkZ + (VISIBILITY - 1) * 16,
//       );
//     }
//   }
//   transform.chunkX = chunkX;
//   transform.chunkZ = chunkZ;
// };

const calcPlayerMovement = (server: Server, transform: Transform, network) => {
  const [x, , z] = transform.translation;

  const chunkX = Math.floor(x / 16) * 16;
  const chunkZ = Math.floor(z / 16) * 16;

  const chunkXold: number = transform.chunkX ?? chunkX;
  const chunkZold: number = transform.chunkZ ?? chunkZ;

  if (chunkX < chunkXold) {
    for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
      server.terrain.sendChunk(
        { socket: network.socket },
        chunkX - (VISIBILITY - 1) * 16,
        chunkZ + i * 16,
      );
    }
  } else if (chunkX > chunkXold) {
    for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
      server.terrain.sendChunk(
        { socket: network.socket },
        chunkX + (VISIBILITY - 1) * 16,
        chunkZ + i * 16,
      );
    }
  }
  if (chunkZ < chunkZold) {
    for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
      server.terrain.sendChunk(
        { socket: network.socket },
        chunkX + i * 16,
        chunkZ - (VISIBILITY - 1) * 16,
      );
    }
  } else if (chunkZ > chunkZold) {
    for (let i = -VISIBILITY; i < VISIBILITY + 1; i += 1) {
      server.terrain.sendChunk(
        { socket: network.socket },
        chunkX + i * 16,
        chunkZ + (VISIBILITY - 1) * 16,
      );
    }
  }
  transform.chunkX = chunkX;
  transform.chunkZ = chunkZ;
};

export default (world: World, server: Server): System => {
  const players = world.createSelector([Transform, Network, Inventory]);
  const syncData = throttle(() => {
    for (const { network, id, transform } of players) {
      send(network.socket, 'SYNC_GAME_DATA', {
        components: getComponentsToUpdate(world, id),
        newObjects: world.lastAddedObjects.filter((el) => el.networkSync),
        deletedObjects: world.lastDeletedObjects,
      });
      calcPlayerMovement(server, transform, network);
    }
  }, 50);
  const networkSystem = () => {
    syncData();

    world.lastAddedObjects = [];
    world.lastDeletedObjects = [];
  };
  return networkSystem;
};
