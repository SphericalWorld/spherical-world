// @flow
import { createReducer } from '../../common/utils/reducerUtils';
import { HUD_DATA_UPDATED } from './hudConstants';

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

export default createReducer(initialState, {
  [HUD_DATA_UPDATED]: onUpdateHudData,
});
