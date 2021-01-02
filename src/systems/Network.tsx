import { React, render } from '../../common/ecs';
import { Input } from '../Input';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import { Transform, Camera, Inventory } from '../components';
import { ServerToClientMessage, ClientToServerMessage } from '../../common/protocol';
import { WorldMainThread, GameEvent } from '../Events';

const onSyncGameData = (world: WorldMainThread, network: Network) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.syncGameData && e)
    .subscribe(({ data: { newObjects = [], deletedObjects = [], components = [] } }) => {
      for (const newObject of newObjects) {
        const Constructor = world.constructors.get(newObject.networkSync.name);
        if (Constructor) {
          render(() => <Constructor {...newObject} />, world);
        }
      }
      for (const deletedObject of deletedObjects) {
        world.deleteEntity(deletedObject, false);
      }
      world.updateComponents(components);
    });

const onLoadControlSettings = (network: Network) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.loadControlSettings && e)
    .subscribe(({ data }) => {
      data.controls.forEach(([action, firstKey, secondKey]) => {
        Input.setKey(firstKey, action, 'first');
        Input.setKey(secondKey, action, 'second');
      });
    });

const onPlayerAddItem = (network: Network, player) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.playerAddItem && e)
    .subscribe(({ data }) => {
      player[0].inventory.data.items[data.slot.id] = data.position;
      player[0].inventory.data.slots[data.position] = data.slot.id;
    });

export default (world: WorldMainThread, network: Network): System => {
  const player = world.createSelector([Transform, Camera, Inventory]);
  world.events
    .filter((el) => el.network === true)
    .subscribe(({ type, payload }) => {
      network.emit({ type, data: payload });
    });

  world.events.subscribe((event) => {
    if (event.type === GameEvent.playerCraftAttempt) {
      network.emit({ type: ClientToServerMessage.playerCraftAttempt, data: event.payload });
    }
  });

  network.events.subscribe(({ type, data }) => {
    // console.log(type, data);
    // world.dispatch({ type, payload: data });
  });

  onSyncGameData(world, network);
  onLoadControlSettings(network);
  onPlayerAddItem(network, player);

  let lastUpdate = Date.now();
  const networkSystem = () => {
    if (Date.now() > lastUpdate + 50) {
      // TODO: replace Date.now() by global engine tick time
      lastUpdate = Date.now();
      network.emit({
        type: ClientToServerMessage.syncGameData,
        data: [
          {
            type: 'transform',
            data: player.map((el) => [el.id, el.transform.serialize()]),
          },
          {
            type: 'camera',
            data: player.map((el) => [el.id, el.camera.serialize()]),
          },
        ],
      });
    }
  };
  return networkSystem;
};
