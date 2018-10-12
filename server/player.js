// @flow
import type { SocketWrapper } from './server';
import type { Entity } from '../common/ecs/Entity';
import type World from '../common/ecs/World';

import Transform from './components/Transform';
import Network from './components/Network';


let id = 1;

export default class Player {
  constructor() {
    this.id = id;
    this.x = 0;
    this.z = 0;
    this.locationName = 'steppe';
    this.name = `Unnamed Player ${id}`;
    this.linkedPlayers = [];
    this.party = [];
    id += 1;
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
) => (id: Entity, socket: SocketWrapper) => {
  const player = world.createEntity(
    id,
    new Transform(0, 132, 0),
    new Network(socket),
  );
  socket.player = player;
  return player;
};

export type CreatePlayer = $Call<typeof playerProvider, *>;
