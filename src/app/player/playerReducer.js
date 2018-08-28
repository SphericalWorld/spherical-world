// @flow
import { createReducer } from '../../common/utils/reducerUtils';

import {
  PLAYER_CHANGED_ROTATION,
} from './playerConstants';

const initialState = {
  mainPlayerId: null,
  instances: {},
};

const onPlayerChangeRotation = (state, { id, horizontalRotate, verticalRotate }) => ({
  ...state,
  instances: {
    ...state.instances,
    [id]: {
      ...state.instances[id],
      horizontalRotate,
      verticalRotate,
    },
  },
});

export default createReducer(initialState, {
  [PLAYER_CHANGED_ROTATION]: onPlayerChangeRotation,
});
