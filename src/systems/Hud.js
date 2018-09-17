// @flow
import type World from '../../common/ecs/World';
import type { System, UpdatedComponents } from '../../common/ecs/System';
import { Transform, UserControlled } from '../components';
import { MENU_TOGGLED } from '../hud/hudConstants';
import { connect } from '../util';
import { updateHudData, toggleMenu } from '../hud/hudActions';

const mapActions = () => ({
  updateHudData,
  toggleMenu,
});

const mapState = ({
  hudData: { states },
}) => ({
  states,
});

export default (ecs: World, store) => {
  class Hud implements System {
    player = ecs.createSelector([Transform, UserControlled]);
    menuToggledObservable = ecs.events
      .filter(e => e.type === MENU_TOGGLED)
      .subscribe(() => this.toggleMenu(!this.states.mainMenuToggled));

    update(delta: number): ?UpdatedComponents {
      this.updateHudData({
        player: {
          position: this.player[0].transform.translation,
        },
      });
    }
  }

  return connect(mapState, mapActions, store)(Hud);
};
