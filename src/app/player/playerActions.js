// @flow
import {
  PLAYER_LOADED,
  PLAYER_CHANGED_ROTATION,
  PLAYER_CHANGE_POSITION,
  PLAYER_JUMPED,
  PLAYER_STOPED_JUMPING,
  PLAYER_RUN,
  PLAYER_STOPED_RUNING,
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  PLAYER_STARTED_REMOVE_BLOCK,
  PLAYER_STOPED_REMOVE_BLOCK,
  PLAYER_PLACED_BLOCK,
} from './playerConstants';
import { terrainPlaceBlock } from '../Terrain/terrainActions';

type Direction =
  | typeof DIRECTION_FORWARD
  | typeof DIRECTION_BACK
  | typeof DIRECTION_LEFT
  | typeof DIRECTION_RIGHT;

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

export const playerJump = (id: number) => ({
  type: PLAYER_JUMPED,
  payload: { id },
  meta: { worker: true },
});

export const playerStopJumping = (id: number) => ({
  type: PLAYER_STOPED_JUMPING,
  payload: { id },
  meta: { worker: true },
});

export const playerRun = (id: number) => ({
  type: PLAYER_RUN,
  payload: { id },
  meta: { worker: true },
});

export const playerStopRun = (id: number) => ({
  type: PLAYER_STOPED_RUNING,
  payload: { id },
  meta: { worker: true },
});

export const playerStartRemoveBlock = (id: number) => (dispatch, getState) => {
  dispatch({
    type: PLAYER_STARTED_REMOVE_BLOCK,
    payload: { id, removingBlock: true },
  });
  const state = getState();
  if (id !== state.players.mainPlayerId) {
    return;
  }
  const {
    block: { x, y, z },
  } = state.raytracer;
  dispatch({
    type: PLAYER_STARTED_REMOVE_BLOCK,
    payload: {
      id,
      x,
      y,
      z,
    },
    meta: { api: true },
  });
};

export const playerStopRemoveBlock = (id: number) => (dispatch, getState) => {
  dispatch({
    type: PLAYER_STOPED_REMOVE_BLOCK,
    payload: { id, removingBlock: false },
  });
  const state = getState();
  if (id !== state.players.mainPlayerId) {
    return;
  }
  dispatch({
    type: PLAYER_STOPED_REMOVE_BLOCK,
    payload: { id },
    meta: { api: true },
  });
};

export const playerPlaceBlock = (id: number) => (dispatch, getState) => {
  // TODO: dispatch(inventoryRemoveItem)
  dispatch({
    type: PLAYER_PLACED_BLOCK,
    payload: { id, removingBlock: true },
  });
  const state = getState();
  if (id !== state.players.mainPlayerId) {
    return;
  }
  const {
    emptyBlockInChunk: { x, y, z }, geoId, plane,
  } = state.raytracer;
  dispatch(terrainPlaceBlock({
    geoId, x, y, z, plane, blockId: 128,
  }));
};
