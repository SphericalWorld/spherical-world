import type { World } from '../../common/ecs';
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

const onSyncGameData = (ecs: World) =>
  ecs.events
    .filter((e) => e.type === ServerToClientMessage.syncGameData)
    .subscribe(({ payload: { newObjects, deletedObjects = [], components = [] } }) => {
      // console.log(newObjects, deletedObjects, components);
      for (const newObject of newObjects) {
        const Constructor = ecs.constructors.get(newObject.networkSync.name);
        if (Constructor) {
          render(() => <Constructor {...newObject} />, ecs);
        }
      }
      for (const deletedObject of deletedObjects) {
        ecs.deleteEntity(deletedObject, false);
      }
      // console.log(components);
      ecs.updateComponents(components);
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

export default (ecs: World, network: Network, input: Input, store: Store): System => {
  const player = ecs.createSelector([Transform, Camera, Inventory]);
  ecs.events
    .filter((el) => el.network === true)
    .subscribe(({ type, payload }) => {
      network.emit({ type, data: payload });
    });

  network.events.subscribe(({ type, data }) => {
    ecs.dispatch({ type, payload: data });
  });

  onSyncGameData(ecs);
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
