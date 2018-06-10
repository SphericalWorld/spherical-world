// @flow
import type { Entity } from '../ecs/Entity';
import type World from '../ecs/World';
import type { System } from './System';
import { Transform, UserControlled } from '../components';
import { connect } from '../util';
import { updateHudData } from '../hud/hudActions';

const mapActions = () => ({
  updateHudData,
});

const hudProvider = (world: World, store) => {
  class Hud implements System {
    player: {
      id: Entity,
      transform: Transform,
    }[] = world.createSelector([Transform, UserControlled]);

    update(delta: number): void {
      this.updateHudData({
        player: {
          position: this.player[0].transform.translation,
        },
      });
    }
  }

  return connect(null, mapActions, store)(Hud);
};

export default hudProvider;
