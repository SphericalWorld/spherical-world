import { HUD_DATA_UPDATED } from './hudConstants';
import {
  INVENTORY_ITEM_DECREASE,
  INVENTORY_ITEM_INCREASE,
} from './components/Inventory/inventoryConstants';

export const updateHudData = (data) => ({
  type: HUD_DATA_UPDATED,
  payload: data,
});

export const inventoryItemDecrease = (id: string) => ({
  type: INVENTORY_ITEM_DECREASE,
  payload: id,
});

export const inventoryItemIncrease = (id: string) => ({
  type: INVENTORY_ITEM_INCREASE,
  payload: id,
});
