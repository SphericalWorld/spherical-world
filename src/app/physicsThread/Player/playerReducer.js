// @flow
import { createReducer } from '../../../common/utils/reducerUtils';

import {
  PLAYER_LOADED,
} from './playerConstants';

const initialState = {
  mainPlayerId: null,
  instances: {},
};

function onPlayerLoaded(state, { playerData, mainPlayer }) {
  if (mainPlayer) {
    return {
      ...state,
      mainPlayerId: playerData.id,
      instances: {
        ...state.instances,
        [playerData.id]: playerData,
      },
    };
  }
  return state;
}

const onPlayerStartedRemoveBlock = (state, { id, removingBlock }) => ({
  ...state,
  instances: {
    ...state.instances,
    [id]: {
      ...state.instances[id],
      removingBlock,
    },
  },
});

const onPlayerStopedRemoveBlock = (state, { id, removingBlock }) => ({
  ...state,
  instances: {
    ...state.instances,
    [id]: {
      ...state.instances[id],
      removingBlock,
    },
  },
});

export default createReducer(initialState, {
  [PLAYER_LOADED]: onPlayerLoaded,
  // [PLAYER_STARTED_REMOVE_BLOCK]: onPlayerStartedRemoveBlock,
  // [PLAYER_STOPED_REMOVE_BLOCK]: onPlayerStopedRemoveBlock,
});
