// @flow
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';

import { Transform } from '../components/index';

export default (world: World, server: Server): System => {
  const components = world.createSelector([Transform]);
  server.events
    .filter(e => e.type === 'SYNC_GAME_DATA')
    .subscribe(({ payload }) => {
      const [id, { translation: data }] = payload.find(el => el.type === 'Transform').data[0];
      server.players.find(el => el.id === id).changeCoord(data[0], data[1], data[2]);
      // ws.player.changeCoord(data.x, data.y, data.z);
      world.updateComponents(payload);
    });

  const networkSystem = (delta: number) => {
    for (const player of server.players) {
      player.socket.postMessage('SYNC_GAME_DATA', {
        type: 'Transform',
        data: components
          .filter(el => el.id !== player.id)
          .map(el => [el.id, el.transform]),
      });
    }
  };
  return networkSystem;
};
