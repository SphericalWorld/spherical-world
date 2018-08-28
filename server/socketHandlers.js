// @flow
import type Server from './server';
import Player from './player';

class SocketHandlers {
  server: Server;

  constructor(server: Server) {
    this.server = server;
    this.router = {};
    console.log('socketHandlers loaded');
  }

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

  playerChangePosition(ws, data, callback) {
    ws.player.changeCoord(data.x, data.y, data.z, (result) => {
      if (!callback) {
        return;
      }
      if (result) {
        callback(true);
        ws.player.broadcastToLinked('OTHER_PLAYER_CHANGE_POSITION', {
          id: ws.player.id, x: ws.player.x, y: ws.player.y, z: ws.player.z,
        });
      } else {
        callback(false, {
          x: ws.player.x, y: ws.player.y, z: ws.player.z,
        });
      }
    });
  }

  playerChangeRotation(ws, data) {
    ws.player.changeRotation(data.v, data.h, (result) => {
      if (result) {
        ws.player.broadcastToLinked('OTHER_PLAYER_CHANGE_ROTATION', { id: ws.player.id, v: ws.player.verticalRotate, h: ws.player.horizontalRotate });
      } else {
        callback(false, {
          x: ws.player.x, y: ws.player.y, z: ws.player.z,
        });
      }
    });
  }

  loadGameData(ws, data, callback) {
    for (let i = -8; i < 8; i += 1) {
      for (let j = -8; j < 8; j += 1) {
        this.terrain.sendChunk(ws.player, i * 16, j * 16);
      }
    }
    callback(true);
  }

  login(ws, data, callback) {
    // data.cookie
    const player = new Player();
    player.terrain = this.server.terrain;
    player.socket = ws;
    ws.player = player;

    for (let i = 0; i < this.server.players.length; i += 1) {
      ws.player.addLink(this.server.players[i]);
    }

    this.server.players.push(player);

    callback(true, {
      id: player.id, name: player.name, x: player.x, y: player.y, z: player.z,
    });

    for (let i = 0; i < ws.player.linkedPlayers.length; i += 1) {
      ws.postMessage('LOAD_OTHER_PLAYER', {
        id: ws.player.linkedPlayers[i].id, name: ws.player.linkedPlayers[i].name, x: ws.player.linkedPlayers[i].x, y: ws.player.linkedPlayers[i].y, z: ws.player.linkedPlayers[i].z,
      });
      ws.player.linkedPlayers[i].socket.postMessage('LOAD_OTHER_PLAYER', {
        id: ws.player.id, name: ws.player.name, x: ws.player.x, y: ws.player.y, z: ws.player.z,
      });
    }
  }
}

module.exports = SocketHandlers;
