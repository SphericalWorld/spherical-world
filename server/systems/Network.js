// @flow
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';

import { Transform, Network } from '../components/index';

export default (world: World, server: Server, createPlayer: CreatePlayer): System => {
  const players = world.createSelector([Transform, Network]);
  server.events
    .filter(e => e.type === 'SYNC_GAME_DATA')
    .subscribe(({ payload }) => {
      world.updateComponents(payload);
    });

  server.events
    .filter(e => e.type === 'LOGIN')
    .subscribe(({ socket }) => {
      // data.cookie
      const playerData = createPlayer(null, socket);
      // player.terrain = this.server.terrain;
      // player.socket = ws;
      // ws.player = player;
      //
      // for (let i = 0; i < this.server.players.length; i += 1) {
      //   ws.player.addLink(this.server.players[i]);
      // }
      //
      // this.server.players.push(player);
      //
      // callback(true, {
      //   id: playerData.id, name: player.name, transform: playerData.transform,
      // });
      //
      // for (let i = 0; i < ws.player.linkedPlayers.length; i += 1) {
      //   ws.postMessage('LOAD_OTHER_PLAYER', {
      //     id: ws.player.linkedPlayers[i].id, name: ws.player.linkedPlayers[i].name, transform: ws.player.linkedPlayers[i].playerData.transform,
      //   });
      //   ws.player.linkedPlayers[i].socket.postMessage('LOAD_OTHER_PLAYER', {
      //     id: playerData.id, name: player.name, transform: playerData.transform,
      //   });
      // }
      socket.postMessage('LOGGED_IN', {
        id: playerData.id, transform: playerData.transform,
      });
    });

  server.events
    .filter(e => e.type === 'loadGameData')
    .subscribe(({ socket }) => {
      socket.postMessage('GAME_START');
      for (let i = -8; i < 8; i += 1) {
        for (let j = -8; j < 8; j += 1) {
          server.terrain.sendChunk({ socket }, i * 16, j * 16);
        }
      }
    });

  server.events
    .filter(e => e.type === 'PLAYER_DESTROYED_BLOCK')
    .subscribe(({ socket, payload }) => {
      // ws.player.broadcastToLinked('PLAYER_DESTROYED_BLOCK', data);
      server.terrain.removeBlockHandler(payload);
    });

  server.events
    .filter(e => e.type === 'PLAYER_PUT_BLOCK')
    .subscribe(({ socket, payload }) => {
      // ws.player.broadcastToLinked('PLAYER_PUT_BLOCK', data);
      server.terrain.putBlockHandler(payload);
    });

  const networkSystem = (delta: number) => {
    for (const { network, id, transform } of players) {
      network.socket.postMessage('SYNC_GAME_DATA', {
        type: 'Transform',
        data: players
          .filter(el => el.id !== id)
          .map(el => [el.id, el.transform]),
      });

      const [x, y, z] = transform.translation;

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
  };
  return networkSystem;
};
