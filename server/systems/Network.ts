import type { World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';
import type { DataStorage } from '../dataStorage';

import { broadcastToLinked, send } from '../network/socket';
import { Transform, Network, Inventory } from '../components';
import defaultInputBindings from '../../common/constants/input/defaultInputBindings';
import { saveGameObject, getGameObject } from '../dataStorage';

const onSyncGameData = (server: Server, world: World) =>
  server.events
    .filter((e) => e.type === 'SYNC_GAME_DATA')
    .subscribe(({ payload }) => {
      world.updateComponents(payload);
    });

const onPlayerPutBlock = (server: Server) =>
  server.events
    .filter((e) => e.type === 'PLAYER_PUT_BLOCK' && e)
    .subscribe(({ socket, payload }) => {
      broadcastToLinked(socket.player, 'PLAYER_PUT_BLOCK', payload);
      socket.player.inventory.data.items[payload.itemId].count -= 1;
      server.terrain.putBlockHandler(payload);
    });

const onPlayerDestroyedBlock = (server: Server, ds: DataStorage) =>
  server.events
    .filter((e) => e.type === 'PLAYER_DESTROYED_BLOCK' && e)
    .subscribe(({ socket, payload }) => {
      broadcastToLinked(socket.player, 'PLAYER_DESTROYED_BLOCK', payload);
      saveGameObject(ds, 'dropableItems')(server.terrain.removeBlockHandler(payload));
    });

const registerNewPlayer = (ds: DataStorage, createPlayer: CreatePlayer) => async (socket) => {
  const player = createPlayer(null, socket);
  await saveGameObject(ds)(player);
  return player;
};

const getPlayer = (ds: DataStorage, createPlayer: CreatePlayer) => async (socket, userId) => {
  const playerData = await getGameObject(ds)(userId);
  const player = createPlayer(playerData, socket);
  return player;
};

const RENDER_DISTANCE = 8;
const VISIBILITY = RENDER_DISTANCE + 2; // 1 chunk around will have loaded lights but not vbo, and another 1 will have no lights loaded

const sendChunks = (server: Server, player) => {
  const [x, , z] = player.transform.translation;
  const {
    network: { socket },
  } = player;
  const flooredX = Math.floor(x / 16);
  const flooredZ = Math.floor(z / 16);

  server.terrain.sendChunk({ socket }, flooredX * 16, flooredZ * 16);
  for (let distance = 1; distance < VISIBILITY + 1; distance += 1) {
    for (let i = -distance; i < distance + 1; i += 1) {
      server.terrain.sendChunk({ socket }, (i + flooredX) * 16, (distance + flooredZ) * 16);
    }
    for (let i = distance - 1; i > -distance; i -= 1) {
      server.terrain.sendChunk({ socket }, (distance + flooredX) * 16, (i + flooredZ) * 16);
    }
    for (let i = distance; i > -distance - 1; i -= 1) {
      server.terrain.sendChunk({ socket }, (i + flooredX) * 16, (-distance + flooredZ) * 16);
    }
    for (let i = -distance + 1; i < distance; i += 1) {
      server.terrain.sendChunk({ socket }, (-distance + flooredX) * 16, (i + flooredZ) * 16);
    }
  }
};

const serialize = ({ id, ...data }) =>
  Object.assign(
    { id },
    ...Object.entries(data)
      .filter(([, value]) => value.constructor.networkable)
      .map(([key, value]) => ({ [key]: value })),
  );

const onLogin = (server: Server, ds: DataStorage, createPlayer: CreatePlayer, players, world) =>
  server.events
    .filter((e) => e.type === 'LOGIN' && e)
    .subscribe(async ({ socket, payload }) => {
      // data.cookie
      const player = payload.userId
        ? await getPlayer(ds, createPlayer)(socket, payload.userId)
        : await registerNewPlayer(ds, createPlayer)(socket);

      const { id, transform, playerData, inventory, camera } = player;
      // player.terrain = this.server.terrain;
      for (const otherPlayer of players) {
        if (id !== otherPlayer.id) {
          player.network.linkedPlayers.push(otherPlayer);
          otherPlayer.network.linkedPlayers.push(player);
        }
      }
      sendChunks(server, player);
      send(socket, 'SYNC_GAME_DATA', {
        newObjects: [...world.objects.values()]
          .filter((el) => el.networkSync && el.id !== id)
          .map(serialize),
      });
      send(socket, 'LOGGED_IN', {
        id,
        transform,
        playerData,
        inventory,
        camera,
      });
      send(socket, 'LOAD_CONTROL_SETTINGS', {
        controls: defaultInputBindings,
      });
      send(socket, 'GAME_START');
    });

export default (
  world: World,
  server: Server,
  ds: DataStorage,
  createPlayer: CreatePlayer,
): System => {
  const players = world.createSelector([Transform, Network, Inventory]);

  onSyncGameData(server, world);
  onPlayerPutBlock(server);
  onPlayerDestroyedBlock(server, ds);
  onLogin(server, ds, createPlayer, players, world);

  const networkSystem = () => {};
  return networkSystem;
};
