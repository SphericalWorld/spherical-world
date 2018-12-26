// @flow strict
import type World from '../../common/ecs/World';
import type { Input } from '../Input/Input';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import { Transform, Camera } from '../components';
import { setKey } from '../Input/Input';
import { setKey as setKeyRedux } from '../hud/components/KeyBindings/keyBindingsActions';

const onSyncGameData = (ecs: World) => ecs.events
  .filter(e => e.type === 'SYNC_GAME_DATA')
  .subscribe(({ payload: { newObjects, components } }) => {
    for (const newObject of newObjects) {
      const constructor = ecs.constructors.get(newObject.networkSync.name);
      if (constructor) {
        constructor(newObject);
      }
    }
    ecs.updateComponents([components]);
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

export default (ecs: World, network: Network, input: Input, store): System => {
  const player = ecs.createSelector([Transform, Camera]);
  const events = ecs.events
    .filter(el => el.network === true)
    .subscribeQueue();

  network.events
    .subscribe(({ type, payload: { data } }) => {
      ecs.dispatch({ type, payload: data });
    });

  onSyncGameData(ecs);
  onLoadControlSettings(ecs, input, store);

  let lastUpdate = Date.now();
  const networkSystem = (delta: number) => {
    const result = [];
    if (Date.now() > lastUpdate + 100) { // TODO: replace Date.now() by global engine tick time
      lastUpdate = Date.now();
      network.emit('SYNC_GAME_DATA', [{
        type: 'Transform',
        data: player
          .map(el => [el.id, el.transform]),
      }]);
    }
    for (const event of events.events) {
      network.emit(event.type, event.payload);
    }
    events.clear();
    return result;
  };
  return networkSystem;
};
