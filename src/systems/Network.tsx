import { React, render } from '../../common/ecs';
import type { Input } from '../Input/Input';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import type { Store } from '../store/store';
import { Transform, Camera, Inventory } from '../components';
import { setKey } from '../Input/Input';
import { setKey as setKeyRedux } from '../hud/components/KeyBindings/keyBindingsActions';
import { ServerToClientMessage, ClientToServerMessage } from '../../common/protocol';
import { blocksInfo } from '../blocks/blockInfo';
import type { WorldMainThread } from '../Events';

const onSyncGameData = (world: WorldMainThread, network: Network) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.syncGameData && e)
    .subscribe(({ data: { newObjects = [], deletedObjects = [], components = [] } }) => {
      // console.log(newObjects, deletedObjects, components);
      for (const newObject of newObjects) {
        const Constructor = world.constructors.get(newObject.networkSync.name);
        if (Constructor) {
          render(() => <Constructor {...newObject} />, world);
        }
      }
      for (const deletedObject of deletedObjects) {
        world.deleteEntity(deletedObject, false);
      }
      // console.log(components);
      world.updateComponents(components);
    });

const onLoadControlSettings = (network: Network, input: Input, store: Store) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.loadControlSettings && e)
    .subscribe(({ data }) => {
      data.controls.forEach(([action, firstKey, secondKey]) => {
        setKey(input, firstKey, action);
        setKey(input, secondKey, action);
        store.dispatch(setKeyRedux(action, firstKey, secondKey));
      });
    });

const onPlayerAddItem = (network: Network, player) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.playerAddItem && e)
    .subscribe(({ data }) => {
      player[0].inventory.data.items[data.id] = data;
    });

export default (world: WorldMainThread, network: Network, input: Input, store: Store): System => {
  const player = world.createSelector([Transform, Camera, Inventory]);
  world.events
    .filter((el) => el.network === true)
    .subscribe(({ type, payload }) => {
      network.emit({ type, data: payload });
    });

  network.events.subscribe(({ type, data }) => {
    // console.log(type, data);
    // world.dispatch({ type, payload: data });
  });

  onSyncGameData(world, network);
  onLoadControlSettings(network, input, store);
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
