// @flow
import type World from '../../common/ecs/World';
import type { System, UpdatedComponents } from '../../common/ecs/System';
import type { Server } from '../server';

import { Transform } from '../components/index';

export default (world: World, server: Server) =>
  class NetworkSystem implements System {
    components = world.createSelector([Transform]);
    networkEvents = server.events
      .filter(e => e.type === 'SYNC_GAME_DATA')
      .subscribe(({ payload }) => {
        // console.log(payload)
        world.updateComponents(payload)
      });

    update(delta: number): ?UpdatedComponents {
      for (const player of server.players) {
        player.socket.postMessage('SYNC_GAME_DATA', {
          type: 'Transform',
          data: this
            .components
            .filter(el => el.id !== player.id)
            .map(el => [el.id, el.transform]),
        });
      }
    }
  };
