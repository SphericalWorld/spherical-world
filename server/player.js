// @flow
import type { Entity } from '../common/ecs/Entity';
import type World from '../common/ecs/World';

import Transform from '../src/components/Transform';

let id = 1;

export default class Player {
  constructor() {
    this.id = id;
    this.x = 0;
    this.z = 0;
    this.dx = 0;
    this.dz = 0;
    this.id = id;
    this.chunksId = [];
    this.locationName = 'steppe';
    this.name = `Unnamed Player ${id}`;
    this.linkedPlayers = [];
    this.party = [];
    id += 1;
  }

  changeCoord(x, y, z) {
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
      this.z = z;
      return true;
    }
    return false;
  }

  changeRotation() {
    return true;
  }

  addChunks(chunks) {
    this.chunksId.push(...chunks);
  }

  removeChunks(chunks) {
    this.chunksId = this.chunksId.filter(item => chunks.indexOf(item) === -1);
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

export const playerProvider = (
  world: World,
) => (id: Entity) => {
  return world.createEntity(id, new Transform(0, 132, 0));
};

export type CreatePlayer = $Call<typeof playerProvider, *>;
