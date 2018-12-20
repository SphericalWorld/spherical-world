// @flow strict
import type World from '../../common/ecs/World';
import type { System, UpdatedComponents } from '../../common/ecs/System';
import { Transform, UserControlled } from '../components';
import { MENU_TOGGLED, INVENTORY_TOGGLED } from '../hud/hudConstants';
import { MAIN_MENU } from '../hud/components/MainMenu/mainMenuConstants';
import { INVENTORY } from '../hud/components/Inventory/inventoryConstants';
import { connect } from '../util';
import { updateHudData } from '../hud/hudActions';
import { toggleUIState } from '../hud/utils/StateRouter';
import { PREVIOUS_ITEM_SELECTED, NEXT_ITEM_SELECTED } from '../hud/components/MainPanel/mainPanelConstants';

const dispatchableEventType = new Set([
  PREVIOUS_ITEM_SELECTED,
  NEXT_ITEM_SELECTED,
]);

const mapActions = () => ({
  updateHudData,
  toggleUIState,
});

const mapState = ({
  hudData: { states },
  keyBindings,
}) => ({
  states,
  keyBindings,
});

export default (ecs: World, store): System => {
  class Hud {
    toggleUIState: typeof toggleUIState;
    updateHudData: typeof updateHudData;

    player = ecs.createSelector([Transform, UserControlled]);
    menuToggledObservable = ecs.events
      .filter(e => e.type === MENU_TOGGLED)
      .subscribe(() => this.toggleUIState(MAIN_MENU));

    inventoryToggledObservable = ecs.events
      .filter(e => e.type === INVENTORY_TOGGLED)
      .subscribe(() => this.toggleUIState(INVENTORY));

    uiActionObservables = ecs.events
      .filter(e => dispatchableEventType.has(e.type))
      .subscribe(e => store.dispatch(e));

    update(delta: number): ?UpdatedComponents {
      this.updateHudData({
        player: {
          position: this.player[0].transform.translation,
        },
      });
    }

    componentDidUpdate() {

    }
  }

  const hud = new (connect(mapState, mapActions, store)(Hud))();
  return delta => hud.update(delta);
};
