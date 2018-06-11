// @flow
// keep constants in integers to be able to use shared memory for input sync in the future
import {
  CAMERA_MOVED,
  CAMERA_LOCKED,
  CAMERA_UNLOCKED,
  PLAYER_MOVED,
  PLAYER_STOPED_MOVE,
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  PLAYER_JUMPED,
} from '../player/events';

export type INPUT_TYPE = 0 | 1 | 2;
export const INPUT_TYPE_ACTION: 0 = 0;
export const INPUT_TYPE_STATE: 1 = 1;
export const INPUT_TYPE_RANGE: 2 = 2;
// TODO: move events to separate files

export const PLAYER_MOVE_FORWARD_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: {
    direction: DIRECTION_FORWARD,
  },
};

export const PLAYER_MOVE_BACKWARD_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: {
    direction: DIRECTION_BACK,
  },
};

export const PLAYER_MOVE_LEFT_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: {
    direction: DIRECTION_LEFT,
  },
};

export const PLAYER_MOVE_RIGHT_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: {
    direction: DIRECTION_RIGHT,
  },
};

export const PLAYER_JUMP_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: PLAYER_JUMPED,
};

export const CAMERA_LOCK_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: CAMERA_LOCKED,
};
