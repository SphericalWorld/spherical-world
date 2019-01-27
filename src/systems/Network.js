// @flow strict
import type World from '../../common/ecs/World';
import type { Input } from '../Input/Input';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import type { Store } from '../store/store';
import { Transform, Camera } from '../components';
import { setKey } from '../Input/Input';
import { setKey as setKeyRedux } from '../hud/components/KeyBindings/keyBindingsActions';

const onSyncGameData = (ecs: World) => ecs.events
  .filter(e => e.type === 'SYNC_GAME_DATA')
  .subscribe(({ payload: { newObjects, deletedObjects = [], components = [] } }) => {
    for (const newObject of newObjects) {
      const constructor = ecs.constructors.get(newObject.networkSync.name);
      if (constructor) {
        constructor(newObject);
      }
    }
    for (const deletedObject of deletedObjects) {
      ecs.deleteEntity(deletedObject, false);
    }
    ecs.updateComponents(components);
  });

const onLoadControlSettings = (ecs: World, input: Input, store) => ecs.events
  .filter(e => e.type === 'LOAD_CONTROL_SETTINGS')
  .subscribe(({ payload }) => {
    payload.controls.forEach(([action, firstKey, secondKey]) => {
      setKey(input, firstKey, action);
      setKey(input, secondKey, action);
      store.dispatch(setKeyRedux(action, firstKey, secondKey));
    });
  });

export default (ecs: World, network: Network, input: Input, store: Store): System => {
  const player = ecs.createSelector([Transform, Camera]);
  ecs.events
    .filter(el => el.network === true)
    .subscribe(({ type, payload }) => {
      network.emit(type, payload);
    });

  network.events
    .subscribe(({ type, payload: { data } }) => {
      ecs.dispatch({ type, payload: data });
    });

  onSyncGameData(ecs);
  onLoadControlSettings(ecs, input, store);

  let lastUpdate = Date.now();
  const networkSystem = () => {
    const result = [];
    if (Date.now() > lastUpdate + 100) { // TODO: replace Date.now() by global engine tick time
      lastUpdate = Date.now();
      network.emit('SYNC_GAME_DATA', [{
        type: 'Transform',
        data: player
          .map(el => [el.id, el.transform.serialize()]),
      }, {
        type: 'Camera',
        data: player
          .map(el => [el.id, el.camera.serialize()]),
      }]);
    }
    return result;
  };
  return networkSystem;
};
