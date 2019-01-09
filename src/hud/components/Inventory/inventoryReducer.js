// @flow strict
import type { Inventory } from '../../../../common/Inventory';
import { createReducer } from '../../../util/reducerUtils';
import { SWAP_INVENTORY_SLOTS, INVENTORY_ITEM_SELECTED } from './inventoryConstants';

type InventoryState = Inventory

const initialState = {
  items: {},
  slots: [],
  selectedItem: null,
};

const swap = (arr, from, to) => {
  const copy = arr.slice();
  const tmp = copy[from];
  copy[from] = copy[to];
  copy[to] = tmp;
  return copy;
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
