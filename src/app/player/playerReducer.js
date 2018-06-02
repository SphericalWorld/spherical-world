// @flow
import { createReducer } from '../../common/utils/reducerUtils';

import {
  PLAYER_LOADED,
  PLAYERS_UPDATED,
  PLAYER_CHANGED_ROTATION,
  PLAYER_STARTED_REMOVE_BLOCK,
  PLAYER_STOPED_REMOVE_BLOCK,
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

const onPlayersUpdated = (state, payload) => ({
  ...state,
  instances: {
    ...state.instances,
    ...Object.entries(payload.players)
      .map(([id, player]) => [id, { ...state.instances[id], ...player }])
      .reduce((prev, [id, player]) => {
        prev[id] = player;
        return prev;
      }, {}),
  },
});

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
  [PLAYER_CHANGED_ROTATION]: onPlayerChangeRotation,
  [PLAYERS_UPDATED]: onPlayersUpdated,
  [PLAYER_STARTED_REMOVE_BLOCK]: onPlayerStartedRemoveBlock,
  [PLAYER_STOPED_REMOVE_BLOCK]: onPlayerStopedRemoveBlock,
});
