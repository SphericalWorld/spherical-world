// @flow
import type World from '../../common/ecs/World';
import type Network from '../network';
import type { System, UpdatedComponents } from '../../common/ecs/System';
import { Transform, Camera } from '../components';

export default (ecs: World, network: Network, Player) =>
  class NetworkSystem implements System {
    player = ecs.createSelector([Transform, Camera]);
    events = ecs.events
      .filter(el => el.network === true)
      .subscribeQueue();

    networkEvents = network.events
      .subscribe(({ type, payload: { data } }) => {
        ecs.dispatch({ type, payload: data });
      });

    onOtherPlayerLoad = ecs.events
      .filter(e => e.type === 'LOAD_OTHER_PLAYER')
      .subscribe((e) => {
        Player(e.payload);
      });

    onSyncData = ecs.events
      .filter(e => e.type === 'SYNC_GAME_DATA')
      .subscribe(({ payload }) => {
        ecs.updateComponents([payload])
      });

    lastUpdate = Date.now();
    update(delta: number): UpdatedComponents {
      const result = [];
      if (Date.now() > this.lastUpdate + 100) { // TODO: replace Date.now() by global engine tick time
        this.lastUpdate = Date.now();
        network.emit('SYNC_GAME_DATA', [{
          type: 'Transform',
          data: this
            .player
            .map(el => [el.id, el.transform]),
        }]);
      }
      for (const event of this.events.events) {
        network.emit(event.type, event.payload);
      }
      this.events.clear();
      return result;
    }
  };
