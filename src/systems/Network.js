// @flow
import { vec3, quat } from 'gl-matrix';
import type World from '../../common/ecs/World';
import type Network from '../network';
import { PLAYER_CHANGE_POSITION, PLAYER_CHANGED_ROTATION } from '../player/playerConstants';
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
        // console.log(type, data)
        ecs.dispatch({ type, payload: data });
      });

    onOtherPlayerLoad = ecs.events
      .filter(e => e.type === 'LOAD_OTHER_PLAYER')
      .subscribe((e) => {
        Player(e.payload);
      });

    onOtherPlayerMoved = ecs.events
      .filter(e => e.type === 'OTHER_PLAYER_CHANGE_POSITION')
      .subscribeQueue();

    onOtherPlayerRotated = ecs.events
      .filter(e => e.type === 'OTHER_PLAYER_CHANGE_ROTATION')
      .subscribeQueue();

    lastUpdate = Date.now();
    update(delta: number): UpdatedComponents {
      const result = [];
      if (Date.now() > this.lastUpdate + 100) { // TODO: replace Date.now() by global engine tick time
        this.lastUpdate = Date.now();
        const [{ id, transform }] = this.player;
        network.emit(PLAYER_CHANGE_POSITION, {
          x: transform.translation[0],
          y: transform.translation[1],
          z: transform.translation[2],
          id,
        });
        network.emit(PLAYER_CHANGED_ROTATION, {
          rotation: transform.rotation,
          id,
        });
      }
      for (const event of this.events.events) {
        network.emit(event.type, event.payload);
      }
      for (const {
        payload: {
          id, x, y, z,
        },
      } of this.onOtherPlayerMoved.events) {
        const transform = ecs.components.get(Transform.name).get(id);
        vec3.set(transform.translation, x, y, z);
        result.push([id, transform]);
      }
      for (const { payload: { id, rotation } } of this.onOtherPlayerRotated.events) {
        const transform = ecs.components.get(Transform.name).get(id);
        quat.copy(transform.rotation, rotation);
        result.push([id, transform]);
      }
      this.events.clear();
      this.onOtherPlayerMoved.clear();
      return result;
    }
  };
