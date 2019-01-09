// @flow strict
import { SWAP_INVENTORY_SLOTS, INVENTORY_ITEM_SELECTED } from './inventoryConstants';
import {
  SWAP_MAIN_PANEL_ITEMS,
  DELETE_MAIN_PANEL_ITEMS,
  COPY_MAIN_PANEL_ITEMS,
} from '../MainPanel/mainPanelConstants';

export const swapSlots = (
  from: number,
  fromSource: string,
  to: number,
  toSource: string,
  value?: string,
) => (dispatch) => {
  if (fromSource === 'inventory' && toSource === 'inventory') {
    dispatch({
      type: SWAP_INVENTORY_SLOTS,
      payload: {
        from,
        to,
      },
    });
  } else if (fromSource === 'inventory' && toSource === 'mainPanel') {
    dispatch({
      type: COPY_MAIN_PANEL_ITEMS,
      payload: {
        value,
        to,
      },
    });
  } else if (fromSource === 'mainPanel' && toSource === 'inventory') {
    dispatch({
      type: DELETE_MAIN_PANEL_ITEMS,
      payload: {
        from,
      },
    });
  } else if (fromSource === 'mainPanel' && toSource === 'mainPanel') {
    dispatch({
      type: SWAP_MAIN_PANEL_ITEMS,
      payload: {
        from,
        to,
      },
    });
  }
};

export const selectInventoryItem = (itemId: string) => ({
  type: INVENTORY_ITEM_SELECTED,
  payload: itemId,
});
