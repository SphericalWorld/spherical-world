// @flow strict
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';
import { broadcastToLinked, send } from '../network/socket';
import { Transform, Network } from '../components/index';
import defaultInputBindings from '../../common/constants/input/defaultInputBindings';

const onSyncGameData = (server: Server, world: World) => server.events
  .filter(e => e.type === 'SYNC_GAME_DATA')
  .subscribe(({ payload }) => {
    world.updateComponents(payload);
  });

const onPlayerPutBlock = (server: Server) => server.events
  .filter(e => e.type === 'PLAYER_PUT_BLOCK' && e)
  .subscribe(({ socket, payload }) => {
    broadcastToLinked(socket.player, 'PLAYER_PUT_BLOCK', payload);
    server.terrain.putBlockHandler(payload);
  });

const onPlayerDestroyedBlock = (server: Server) => server.events
  .filter(e => e.type === 'PLAYER_DESTROYED_BLOCK' && e)
  .subscribe(({ socket, payload }) => {
    broadcastToLinked(socket.player, 'PLAYER_DESTROYED_BLOCK', payload);
    server.terrain.removeBlockHandler(payload);
  });

const onLogin = (server: Server, createPlayer: CreatePlayer, players) => server.events
  .filter(e => e.type === 'LOGIN' && e)
  .subscribe(({ socket }) => {
    // data.cookie
    const player = createPlayer(null, socket);
    const {
      id, transform, playerData, inventory,
    } = player;
    // player.terrain = this.server.terrain;
    for (const otherPlayer of players) {
      if (id !== otherPlayer.id) {
        player.network.linkedPlayers.push(otherPlayer);
        otherPlayer.network.linkedPlayers.push(player);
      }
    }
    send(socket, 'LOGGED_IN', {
      id, transform, playerData, inventory,
    });
    send(socket, 'LOAD_CONTROL_SETTINGS', {
      controls: defaultInputBindings,
    });
  });

const onLoadGameData = (server: Server) => server.events
  .filter(e => e.type === 'loadGameData' && e)
  .subscribe(({ socket }) => {
    send(socket, 'GAME_START');
    for (let i = -8; i < 8; i += 1) {
      for (let j = -8; j < 8; j += 1) {
        server.terrain.sendChunk({ socket }, i * 16, j * 16);
      }
    }
  });

export default (world: World, server: Server, createPlayer: CreatePlayer): System => {
  const players = world.createSelector([Transform, Network]);

  onSyncGameData(server, world);
  onPlayerPutBlock(server);
  onPlayerDestroyedBlock(server);
  onLogin(server, createPlayer, players);
  onLoadGameData(server);

  const networkSystem = (delta: number) => {
    for (const { network, id, transform } of players) {
      send(network.socket, 'SYNC_GAME_DATA', {
        components: {
          type: 'Transform',
          data: players
            .filter(el => el.id !== id)
            .map(el => [el.id, el.transform]),
        },
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
