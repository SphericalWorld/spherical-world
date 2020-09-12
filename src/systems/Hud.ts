import type { System } from '../../common/ecs/System';
import type { Input } from '../Input/Input';
import type { Store } from '../store/store';
import { Transform, UserControlled, Inventory } from '../components';
import { MAIN_MENU } from '../hud/components/MainMenu/mainMenuConstants';
import { INVENTORY } from '../hud/components/Inventory/inventoryConstants';
import { connect } from '../util';
import {
  updateHudData as doUpdateHudData,
  inventoryItemDecrease,
  inventoryItemIncrease,
} from '../hud/hudActions';
import {
  GAMEPLAY_MAIN_CONTEXT,
  GAMEPLAY_MENU_CONTEXT,
  KEY_BINDING_CONTEXT,
} from '../Input/inputContexts';
import { setKey } from '../Input/Input';
import { throttle } from '../../common/utils';
import { ServerToClientMessage } from '../../common/protocol';
import type { State } from '../reducers/rootReducer';
import type Network from '../network';
import { WorldMainThread, GameEvent } from '../Events';

const mapState = ({
  keyBindings,
  hudData: {
    player: { inventory },
  },
}: State) => ({
  keyBindings,
  inventory,
});

const onInventoryChanged = (world: WorldMainThread, store: Store) =>
  world.events
    .filter((e) => e.type === GameEvent.playerPutBlock && e)
    .subscribe((e) => store.dispatch(inventoryItemDecrease(e.payload.itemId)));

const onDispatchableEvent = (events, store: Store) =>
  events
    .filter((e) => e.uiEvent)
    .subscribe((e) => store.dispatch(typeof e.uiEvent === 'function' ? e.uiEvent(e) : e.uiEvent));

const onStateChanged = (input: Input, player) => (
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

const onPlayerAddItem = (network: Network, store: Store) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.playerAddItem && e)
    .subscribe(({ data }) => {
      store.dispatch(inventoryItemIncrease(data.id));
    });

export default (world: WorldMainThread, store: Store, input: Input, network: Network): System => {
  const player = world.createSelector([Transform, UserControlled, Inventory]);

  onDispatchableEvent(world.events, store);
  onInventoryChanged(world, store);
  onPlayerAddItem(network, store);
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
