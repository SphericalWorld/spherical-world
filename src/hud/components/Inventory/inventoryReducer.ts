import type { Inventory } from '../../../../common/Inventory';
import { createReducer } from '../../../util/reducerUtils';
import { SWAP_INVENTORY_SLOTS, INVENTORY_ITEM_SELECTED } from './inventoryConstants';
import { swap } from '../../../../common/utils/array';

type InventoryState = Inventory;

const initialState = {
  items: {},
  slots: [],
  selectedItem: null,
};

const onUpdateHudData = (state, data) => ({
  ...state,
  slots: swap(state.slots, data.from, data.to),
});

const onInventoryItemSelected = (state, selectedItem) => ({
  ...state,
  selectedItem,
});

export default createReducer<InventoryState>(initialState, {
  [SWAP_INVENTORY_SLOTS]: onUpdateHudData,
  [INVENTORY_ITEM_SELECTED]: onInventoryItemSelected,
});
