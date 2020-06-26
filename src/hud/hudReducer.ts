import type { vec3 } from 'gl-matrix';
import type { Inventory } from '../../common/Inventory';
import { createReducer } from '../util/reducerUtils';
import { HUD_DATA_UPDATED } from './hudConstants';

export type HUDState = {
  mainPlayerId: string | null,
  player: {
    position: vec3,
    inventory: Inventory,
  },
}

const initialState = {
  mainPlayerId: null,
  player: {
    position: [0, 0, 0],
    inventory: {
      items: {},
      slots: [],
      selectedItem: null,
    },
  },
};

const onUpdateHudData = (state, data) => ({
  ...state,
  ...data,
});

export default createReducer<HUDState>(initialState, {
  [HUD_DATA_UPDATED]: onUpdateHudData,
});
