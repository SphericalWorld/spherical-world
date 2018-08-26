// @flow
import {
  PLAYER_LOADED,
  PLAYER_CHANGED_ROTATION,
} from './playerConstants';

export const loadPlayer = (playerData: Object, mainPlayer: boolean) => ({
  type: PLAYER_LOADED,
  payload: { playerData, mainPlayer },
  meta: { worker: true },
});

let oldTimeChangeRotation = Date.now();

export const playerChangeRotation = (movementX: number, movementY: number) => (dispatch, getState) => {
  const state = getState();
  const player = state.players.instances[state.players.mainPlayerId];
  const horizontalRotate = player.horizontalRotate - (0.005 * movementX);
  const verticalRotate = player.verticalRotate - (0.005 * movementY);
  dispatch({
    type: PLAYER_CHANGED_ROTATION,
    payload: {
      horizontalRotate,
      verticalRotate,
      id: state.players.mainPlayerId,
    },
    meta: { worker: true },
  });

  const newDate = new Date().getTime();
  if (newDate > oldTimeChangeRotation + 200) {
    oldTimeChangeRotation = newDate;
    dispatch({
      type: PLAYER_CHANGED_ROTATION,
      payload: { v: verticalRotate, h: horizontalRotate },
      meta: { api: true },
    });
  }
};
