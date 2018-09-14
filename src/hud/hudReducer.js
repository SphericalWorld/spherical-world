// @flow
import { createReducer } from '../common/utils/reducerUtils';
import { HUD_DATA_UPDATED, MENU_TOGGLED } from './hudConstants';

const initialState = {
  mainPlayerId: null,
  player: {
    position: [],
  },
  states: {
    mainMenuToggled: false,
  },
};

const onUpdateHudData = (state, data) => ({
  ...state,
  ...data,
});

const onMenuToggle = (state, data) => ({
  ...state,
  states: {
    ...state.states,
    mainMenuToggled: data,
  },
});

export default createReducer(initialState, {
  [HUD_DATA_UPDATED]: onUpdateHudData,
  [MENU_TOGGLED]: onMenuToggle,
});
