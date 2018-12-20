// @flow strict
import { createReducer } from '../../../util/reducerUtils';
import { PREVIOUS_ITEM_SELECTED, NEXT_ITEM_SELECTED } from './mainPanelConstants';

const initialState = {
  selectedItemIndex: 0,
  slots: (new Array(10)).fill(0).map((_, index) => ({
    count: index,
    image: `${Math.random() > 0.5 ? 'diamond' : 'ironIngot'}`,
    id: String(index),
  })),
};

export default createReducer<typeof initialState>(initialState, {
  [NEXT_ITEM_SELECTED]: state => ({
    ...state,
    selectedItemIndex: (state.selectedItemIndex + 1) % state.slots.length,
  }),
  [PREVIOUS_ITEM_SELECTED]: state => ({
    ...state,
    selectedItemIndex: (state.slots.length + state.selectedItemIndex - 1) % state.slots.length,
  }),
});
