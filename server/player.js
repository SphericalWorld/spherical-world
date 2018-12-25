// @flow strict
import type { Socket } from './network/socket';
import type { Entity } from '../common/ecs/Entity';
import type World from '../common/ecs/World';

import Transform from './components/Transform';
import Network from './components/Network';
import PlayerData from './components/PlayerData';
import Inventory from './components/Inventory';

let id = 1;

export default class Player {
  constructor() {
    this.locationName = 'steppe';
    this.party = [];
    id += 1;
  }

  addLink(player) {
    this.linkedPlayers.push(player);
    player.linkedPlayers.push(this);
  }

  destroy() {
    this.broadcastToLinked('OTHER_PLAYER_DISCONNECT', { id: this.id });
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
) => (id: Entity, socket: Socket) => {
  const player = world.createEntity(
    id,
    new Transform(0, 132, 0),
    new PlayerData(`Unnamed Player ${id}`),
    new Network(socket),
    new Inventory(),
  );
  socket.player = player;
  return player;
};

export type CreatePlayer = $Call<typeof playerProvider, *>;
