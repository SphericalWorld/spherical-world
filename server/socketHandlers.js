// @flow
import type { CreatePlayer } from './player';
import type { Server } from './server';
import Player from './player';

const socketHandlersProvider = (createPlayer: CreatePlayer) => class SocketHandlers {
  server: Server;
  router = {};

  route(message: string, handler: Function, needAuth: boolean = true) {
    this.router[message] = { handler, needAuth };
  }

  putBlock(ws, data) {
    this.server.terrain.putBlockHandler(data);
    ws.player.broadcastToLinked('PLAYER_PUT_BLOCK', data);
  }

  removeBlock(ws, data) {
    this.server.terrain.removeBlockHandler(data);
    ws.player.broadcastToLinked('PLAYER_DESTROYED_BLOCK', data);
  }

  loadGameData(ws, data, callback) {
    for (let i = -8; i < 8; i += 1) {
      for (let j = -8; j < 8; j += 1) {
        this.server.terrain.sendChunk(ws.player, i * 16, j * 16);
      }
    }
    callback(true);
  }

  login(ws, data, callback) {
    // data.cookie
    const player = new Player();
    const playerData = createPlayer(player.id);
    player.playerData = playerData;
    player.terrain = this.server.terrain;
    player.socket = ws;
    ws.player = player;

    for (let i = 0; i < this.server.players.length; i += 1) {
      ws.player.addLink(this.server.players[i]);
    }

    this.server.players.push(player);

    callback(true, {
      id: playerData.id, name: player.name, transform: playerData.transform,
    });

    for (let i = 0; i < ws.player.linkedPlayers.length; i += 1) {
      ws.postMessage('LOAD_OTHER_PLAYER', {
        id: ws.player.linkedPlayers[i].id, name: ws.player.linkedPlayers[i].name, transform: ws.player.linkedPlayers[i].playerData.transform,
      });
      ws.player.linkedPlayers[i].socket.postMessage('LOAD_OTHER_PLAYER', {
        id: playerData.id, name: player.name, transform: playerData.transform,
      });
    }
  }
};

declare var tmp: $Call<typeof socketHandlersProvider, CreatePlayer>;
export type SocketHandlers = tmp;

export default socketHandlersProvider;
