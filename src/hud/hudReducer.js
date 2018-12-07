// @flow
import { createReducer } from '../util/reducerUtils';
import { HUD_DATA_UPDATED } from './hudConstants';

const initialState = {
  mainPlayerId: null,
  player: {
    position: [],
  },
};

const onUpdateHudData = (state, data) => ({
  ...state,
  ...data,
});

export default createReducer<typeof initialState>(initialState, {
  [HUD_DATA_UPDATED]: onUpdateHudData,
});
