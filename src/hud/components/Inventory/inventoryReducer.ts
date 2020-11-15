import type { Inventory } from '../../../../common/Inventory';
import { createReducer } from '../../../util/reducerUtils';
import {
  SWAP_INVENTORY_SLOTS,
  INVENTORY_ITEM_SELECTED,
  INVENTORY_ITEM_DECREASE,
  INVENTORY_ITEM_INCREASE,
} from './inventoryConstants';
import { swap } from '../../../../common/utils/array';
import type { SlotInfo } from '../../../../common/Inventory/Inventory';

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

const onInventoryItemDecrease = (state: InventoryState, id: string) => {
  const item = state.items[id];

  if (!item) return state;
  return { ...state, items: { ...state.items, [id]: { ...item, count: item.count } } };
};

const onInventoryItemIncrease = (state: InventoryState, id: string) => {
  const item = state.items[id];

  if (!item) return state;
  return { ...state, items: { ...state.items, [id]: { ...item, count: item.count } } };
};

const onInventoryItemSet = (state: InventoryState, data: SlotInfo) => {
  const copy = state.slots.slice();
  copy[data.position] = data.slot.id;

  return { ...state, items: { ...state.items, [data.slot.id]: data.slot }, slots: copy };
};

export default createReducer<InventoryState>(initialState, {
  [SWAP_INVENTORY_SLOTS]: onUpdateHudData,
  [INVENTORY_ITEM_SELECTED]: onInventoryItemSelected,
  [INVENTORY_ITEM_DECREASE]: onInventoryItemDecrease,
  [INVENTORY_ITEM_INCREASE]: onInventoryItemIncrease,
  INVENTORY_ITEM_SET: onInventoryItemSet,
});
