// @flow strict
import type { SlotID } from '../../../../common/Inventory';
import { createReducer } from '../../../util/reducerUtils';
import { PREVIOUS_ITEM_SELECTED, NEXT_ITEM_SELECTED } from './mainPanelConstants';

type MainPanel = {|
  selectedItemIndex: number;
  slots: $ReadOnlyArray<SlotID | null>;
|}

const initialState = {
  selectedItemIndex: 0,
  slots: (new Array(10)).fill(0).map(() => (Math.random() > 0.5 ? 'id2' : 'id4')),
};

export default createReducer<MainPanel>(initialState, {
  [NEXT_ITEM_SELECTED]: state => ({
    ...state,
    selectedItemIndex: (state.selectedItemIndex + 1) % state.slots.length,
  }),
  [PREVIOUS_ITEM_SELECTED]: state => ({
    ...state,
    selectedItemIndex: (state.slots.length + state.selectedItemIndex - 1) % state.slots.length,
  }),
});
