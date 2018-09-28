// @flow
import type World from '../../common/ecs/World';
import type Network from '../network';
import type { System } from '../../common/ecs/System';
import { Transform, Camera } from '../components';

export default (ecs: World, network: Network, Player): System => {
  const player = ecs.createSelector([Transform, Camera]);
  const events = ecs.events
    .filter(el => el.network === true)
    .subscribeQueue();

  network.events
    .subscribe(({ type, payload: { data } }) => {
      ecs.dispatch({ type, payload: data });
    });

  ecs.events
    .filter(e => e.type === 'LOAD_OTHER_PLAYER')
    .subscribe((e) => {
      Player(e.payload);
    });

  ecs.events
    .filter(e => e.type === 'SYNC_GAME_DATA')
    .subscribe(({ payload }) => {
      ecs.updateComponents([payload]);
    });

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
