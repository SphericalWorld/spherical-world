import type { System } from '../../common/ecs/System';
import { Store, uiRouterState } from '../store/store';
import { Transform, UserControlled, Inventory } from '../components';
import { MAIN_MENU } from '../hud/components/MainMenu/mainMenuConstants';
import { INVENTORY } from '../hud/components/Inventory/inventoryConstants';
import { connect } from '../util';
import {
  updateHudData as doUpdateHudData,
  inventoryItemDecrease,
  inventoryItemSet,
} from '../hud/hudActions';
import { throttle } from '../../common/utils';
import { ServerToClientMessage } from '../../common/protocol';
import type { State } from '../reducers/rootReducer';
import type Network from '../network';
import { WorldMainThread, GameEvent } from '../Events';
import { InputAction } from '../Input/InputAction';
import { InputEvent } from '../../common/constants/input/eventTypes';

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

const onDispatchableEvent = () => {
  InputAction.on(InputEvent.toggleMenu, () =>
    uiRouterState.setState((state) => ({ ...state, MAIN_MENU: !state.MAIN_MENU })),
  );
  InputAction.on(InputEvent.toggleInventory, () =>
    uiRouterState.setState((state) => ({ ...state, INVENTORY: !state.INVENTORY })),
  );
  InputAction.on(InputEvent.toggleCraft, () =>
    uiRouterState.setState((state) => ({ ...state, CRAFT: !state.CRAFT })),
  );
};

const onStateChanged = (player) => ({ inventory: inventoryOld }, { inventory }) => {
  if (inventoryOld !== inventory && player[0]) {
    player[0].inventory.data = inventory;
  }
};

const onPlayerAddItem = (network: Network, store: Store) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.playerAddItem && e)
    .subscribe(({ data }) => {
      store.dispatch(inventoryItemSet(data));
    });

export default (world: WorldMainThread, store: Store, network: Network): System => {
  const player = world.createSelector([Transform, UserControlled, Inventory]);

  onDispatchableEvent();
  onInventoryChanged(world, store);
  onPlayerAddItem(network, store);
  connect(mapState, store)(onStateChanged(player));
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
