// @flow

let id = 1;

export default class Player {
  constructor(x, y, z) {
    this.id = id;
    this.x = 0;
    this.y = 132;
    this.z = 0;
    this.dx = 0;
    this.dz = 0;
    this.v = 0;
    this.verticalRotate = 0;
    this.horizontalRotate = 0;
    this.id = id;
    this.chunksId = [];
    this.locationName = 'steppe';
    this.name = `Unnamed Player ${id}`;
    this.linkedPlayers = [];
    this.party = [];
    id += 1;
  }

  changeCoord(x, y, z, callback) {
    if (true) {
      const chunkXold = Math.floor(x / 16) * 16;
      const chunkZold = Math.floor(z / 16) * 16;

      const chunkX = Math.floor(this.x / 16) * 16;
      const chunkZ = Math.floor(this.z / 16) * 16;
      if (chunkXold > chunkX) {
        for (let i = -8; i < 8; i += 1) {
          this.terrain.sendChunk(this, chunkX + (8 * 16), chunkZ + (i * 16));
        }
      } else if (chunkXold < chunkX) {
        for (let i = -8; i < 8; i += 1) {
          this.terrain.sendChunk(this, chunkX - (8 * 16), chunkZ + (i * 16));
        }
      }
      if (chunkZold > chunkZ) {
        for (let i = -8; i < 8; i += 1) {
          this.terrain.sendChunk(this, chunkX + (i * 16), chunkZ + (8 * 16));
        }
      } else if (chunkZold < chunkZ) {
        for (let i = -8; i < 8; i += 1) {
          this.terrain.sendChunk(this, chunkX + (i * 16), chunkZ - (8 * 16));
        }
      }
      this.x = x;
      this.y = y;
      this.z = z;
      callback(true);
    } else {
      callback(false);
    }
  }

  changeRotation(verticalRotate, horizontalRotate, callback) {
    if (true) {
      this.verticalRotate = verticalRotate;
      this.horizontalRotate = horizontalRotate;
      callback(true);
    } else {
      callback(false);
    }
  }

  addChunks(chunks) {
    this.chunksId.push.apply(this.chunksId, chunks);
  }

  removeChunks(chunks) {
    this.chunksId = this.chunksId.filter(item => chunks.indexOf(item) === -1);
  }

  getChunks() {
    return this.chunksId;
  }

  addLink(player) {
    this.linkedPlayers.push(player);
    player.linkedPlayers.push(this);
  }

  deleteLink(player) {
    this.linkedPlayers.splice(this.linkedPlayers.indexOf(player), 1);
    player.linkedPlayers.splice(player.linkedPlayers.indexOf(this), 1);
  }

  broadcastToLinked(message, data) {
    for (let i = 0; i < this.linkedPlayers.length; i += 1) {
      this.linkedPlayers[i].socket.postMessage(message, data);
    }
  }

  destroy() {
    this.broadcastToLinked('OTHER_PLAYER_DISCONNECT', { id: this.id });
    for (let i = 0; i < this.linkedPlayers.length; i += 1) {
      this.deleteLink(this.linkedPlayers[i]);
    }
  }

  static startRemoveBlock(ws, data) {
    if ((typeof data === 'object') && (typeof data.x === 'number') && (typeof data.y === 'number') && (typeof data.z === 'number')) {
      ws.player.broadcastToLinked('OTHER_PLAYER_START_REMOVE_BLOCK', {
        id: ws.player.id, x: data.x, y: data.y, z: data.z,
      });
    }
  }

  static stopRemoveBlock(ws) {
    ws.player.broadcastToLinked('OTHER_PLAYER_STOP_REMOVE_BLOCK', { id: ws.player.id });
  }
}
