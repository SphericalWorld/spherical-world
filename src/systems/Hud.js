// @flow strict
import type World from '../../common/ecs/World';
import type { System, UpdatedComponents } from '../../common/ecs/System';
import type { Input } from '../Input/Input';
import { Transform, UserControlled } from '../components';
import { MENU_TOGGLED, INVENTORY_TOGGLED } from '../hud/hudConstants';
import { MAIN_MENU } from '../hud/components/MainMenu/mainMenuConstants';
import { INVENTORY } from '../hud/components/Inventory/inventoryConstants';
import { connect } from '../util';
import { updateHudData } from '../hud/hudActions';
import { toggleUIState } from '../hud/utils/StateRouter';
import {
  GAMEPLAY_MAIN_CONTEXT,
  GAMEPLAY_MENU_CONTEXT,
  KEY_BINDING_CONTEXT,
} from '../Input/inputContexts';
import { setKey } from '../Input/Input';

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

export default (ecs: World, store, dispatchableEvents: Set<string>, input: Input): System => {
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
      .filter(e => dispatchableEvents.has(e.type))
      .subscribe(e => store.dispatch(e));

    update(delta: number): ?UpdatedComponents {
      this.updateHudData({
        player: {
          position: this.player[0].transform.translation,
        },
      });
    }

    componentDidUpdate() {
      if (this.keyBindings.editing) {
        input.deactivateContext(GAMEPLAY_MENU_CONTEXT);
        input.deactivateContext(GAMEPLAY_MAIN_CONTEXT);
        input.activateContext(KEY_BINDING_CONTEXT);
      } else {
        input.activateContext(GAMEPLAY_MENU_CONTEXT);
        input.deactivateContext(KEY_BINDING_CONTEXT);
        setKey(input, this.keyBindings.key, this.keyBindings.action);
      }
    }
  }

  const hud = new (connect(mapState, mapActions, store)(Hud))();
  return delta => hud.update(delta);
};
