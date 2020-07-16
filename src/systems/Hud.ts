import type { World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Input } from '../Input/Input';
import type { Store } from '../store/store';
import { Transform, UserControlled, Inventory } from '../components';
import { MENU_TOGGLED, INVENTORY_TOGGLED } from '../hud/hudConstants';
import { MAIN_MENU } from '../hud/components/MainMenu/mainMenuConstants';
import { INVENTORY } from '../hud/components/Inventory/inventoryConstants';
import { connect } from '../util';
import { updateHudData as doUpdateHudData } from '../hud/hudActions';
import { toggleUIState as doToggleUIState } from '../hud/utils/StateRouter';
import {
  GAMEPLAY_MAIN_CONTEXT,
  GAMEPLAY_MENU_CONTEXT,
  KEY_BINDING_CONTEXT,
} from '../Input/inputContexts';
import { setKey } from '../Input/Input';
import { throttle } from '../../common/utils';

const mapState = ({
  keyBindings,
  hudData: {
    player: { inventory },
  },
}) => ({
  keyBindings,
  inventory,
});

const onMenuToggled = (events, toggleUIState) =>
  events.filter((e) => e.type === MENU_TOGGLED).subscribe(() => toggleUIState(MAIN_MENU));

const onInventoryToggled = (events, toggleUIState) =>
  events.filter((e) => e.type === INVENTORY_TOGGLED).subscribe(() => toggleUIState(INVENTORY));

const onDispatchableEvent = (events, store) =>
  events.filter((e) => e.dispatchable).subscribe((e) => store.dispatch(e));

const onStateChanged = (input, player) => (
  { keyBindings: { editing }, inventory: inventoryOld },
  { keyBindings, inventory },
) => {
  if (inventoryOld !== inventory && player[0]) {
    player[0].inventory.data = inventory;
  }
  if (keyBindings.editing !== editing) {
    if (keyBindings.editing) {
      input.deactivateContext(GAMEPLAY_MENU_CONTEXT);
      input.deactivateContext(GAMEPLAY_MAIN_CONTEXT);
      input.activateContext(KEY_BINDING_CONTEXT);
    } else {
      input.activateContext(GAMEPLAY_MENU_CONTEXT);
      input.deactivateContext(KEY_BINDING_CONTEXT);
      setKey(input, keyBindings.key, keyBindings.action);
    }
  }
};

export default (ecs: World, store: Store, input: Input): System => {
  const player = ecs.createSelector([Transform, UserControlled, Inventory]);
  const toggleUIState = (...params) => store.dispatch(doToggleUIState(...params));

  onMenuToggled(ecs.events, toggleUIState);
  onInventoryToggled(ecs.events, toggleUIState);
  onDispatchableEvent(ecs.events, store);
  connect(mapState, store)(onStateChanged(input, player));
  const syncData = throttle((data) => store.dispatch(doUpdateHudData(data)), 100);
  return () => {
    syncData({
      player: {
        position: player[0].transform.translation,
        inventory: player[0].inventory.data,
      },
    });
  };
};
