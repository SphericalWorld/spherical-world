// @flow
import type World from '../../common/ecs/World';
import type { Input } from '../Input/Input';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import { Transform, Camera } from '../components';
import { setKey } from '../Input/Input';
import { setKey as setKeyRedux } from '../hud/components/KeyBindings/keyBindingsActions';

const onLoadOtherPlayer = (ecs: World, Player) => ecs.events
  .filter(e => e.type === 'LOAD_OTHER_PLAYER')
  .subscribe((e) => {
    Player(e.payload);
  });

const onSyncGameData = (ecs: World, createItem) => ecs.events
  .filter(e => e.type === 'SYNC_GAME_DATA')
  .subscribe(({ payload: { newObjects, components } }) => {
    for (const newObject of newObjects) {
      createItem(null, newObject);
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

export default (ecs: World, network: Network, input: Input, Player, store, createItem): System => {
  const player = ecs.createSelector([Transform, Camera]);
  const events = ecs.events
    .filter(el => el.network === true)
    .subscribeQueue();

  network.events
    .subscribe(({ type, payload: { data } }) => {
      ecs.dispatch({ type, payload: data });
    });

  onLoadOtherPlayer(ecs, Player);
  onSyncGameData(ecs, createItem);
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
