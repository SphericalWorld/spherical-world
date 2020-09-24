import { vec3 } from 'gl-matrix';
import type { Socket } from './network/socket';
import type { World } from '../common/ecs/World';
import { Transform, Network, PlayerData, Inventory, NetworkSync, Camera } from './components';
import { createStubItems } from '../common/Inventory/Inventory';
import { render, React, GameObject } from '../common/ecs';

type SerializedPlayerData = GameObject<[typeof Transform, typeof Inventory, typeof Camera]>;

export const playerProvider = (world: World) => (
  playerData: SerializedPlayerData | null,
  socket: Socket,
) => {
  socket.player = render(
    () =>
      playerData ? (
        <GameObject id={playerData.id}>
          <Transform {...playerData.transform} />
          <PlayerData name={`Unnamed Player ${playerData.id}`} />
          <Network socket={socket} />
          <Inventory {...playerData.inventory.data} />
          <NetworkSync name="PLAYER" />
          <Camera {...playerData.camera} />
        </GameObject>
      ) : (
        <GameObject>
          <Transform translation={vec3.fromValues(0, 65, 0)} />
          <PlayerData name="Unnamed Player" />
          <Network socket={socket} />
          <Inventory {...createStubItems()} />
          <NetworkSync name="PLAYER" />
          <Camera />
        </GameObject>
      ),
    world,
  );
  return socket.player;
};

export type CreatePlayer = ReturnType<typeof playerProvider>;
