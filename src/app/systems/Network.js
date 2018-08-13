// @flow
import type { Entity } from '../ecs/Entity';
import type World from '../ecs/World';
import type Network from '../network';
import { PLAYER_CHANGE_POSITION } from '../player/playerConstants';
import { System } from './System';
import { Transform, Camera } from '../components';

const networkProvider = (world: World, network: Network) =>
  class NetworkSystem implements System {
    player: {
      id: Entity,
      transform: Transform,
      camera: Camera,
    }[] = world.createSelector([Transform, Camera]);

    events = world.events
      .filter(el => el.network === true)
      .subscribe((event) => {
        console.log(event);
      });

    lastUpdate = Date.now();
    update(delta: number): void {
      if (Date.now() > this.lastUpdate + 1000) { // TODO: replace Date.now() by global engine tick time
        this.lastUpdate = Date.now();
        const [{ id, transform }] = this.player;
        network.emit(PLAYER_CHANGE_POSITION, {
          x: transform.translation[0],
          y: transform.translation[1],
          z: transform.translation[2],
          id,
        });
      }
    }
  };

export default networkProvider;
