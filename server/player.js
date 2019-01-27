// @flow strict
import { vec3 } from 'gl-matrix';
import type { Socket } from './network/socket';
import type { GameObject } from '../common/ecs';
import type World from '../common/ecs/World';
import {
  Transform, Network, PlayerData, Inventory, NetworkSync, Camera,
} from './components';
import { createStubItems } from '../common/Inventory/Inventory';

export default class Player {
  constructor() {
    this.locationName = 'steppe';
    this.party = [];
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

type SerializedPlayerData = GameObject<[typeof Transform, typeof Inventory, typeof Camera]>;

export const playerProvider = (
  world: World,
) => (playerData: ?SerializedPlayerData, socket: Socket) => {
  const player = playerData
    ? world.createEntity(
      playerData.id,
      Transform.deserialize(playerData.transform),
      new PlayerData(`Unnamed Player ${playerData.id}`),
      new Network(socket),
      Inventory.deserialize(playerData.inventory),
      new NetworkSync({ name: 'PLAYER' }),
      Camera.deserialize(playerData.camera),
    )
    : world.createEntity(
      null,
      new Transform(vec3.fromValues(0, 65, 0)),
      new PlayerData('Unnamed Player'),
      new Network(socket),
      new Inventory(createStubItems()),
      new NetworkSync({ name: 'PLAYER' }),
      new Camera(),
    );
  socket.player = player;
  return player;
};

export type CreatePlayer = $Call<typeof playerProvider, *>;
