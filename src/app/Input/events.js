// @flow
// keep constants in integers to be able to use shared memory for input sync in the future
import RangeInputEvent from './RangeInputEvent';
import { MENU_TOGGLED } from '../hud/hudConstants';
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
  PLAYER_RUN,
  PLAYER_STOPED_RUN,
  PLAYER_ATTACKED,
  PLAYER_STOPED_ATTACK,
  PLAYER_START_PUT_BLOCK,
} from '../player/events';

export const INPUT_TYPE_ACTION: 0 = 0;
export const INPUT_TYPE_STATE: 1 = 1;
export const INPUT_TYPE_RANGE: 2 = 2;

export type INPUT_TYPE =
  | typeof INPUT_TYPE_ACTION
  | typeof INPUT_TYPE_STATE
  | typeof INPUT_TYPE_RANGE;

// TODO: move events to separate files

export const CAMERA_MOVED_EVENT = {
  type: INPUT_TYPE_RANGE,
  gameEvent: CAMERA_MOVED,
  data: ({ x, y, z }: RangeInputEvent) => ({
    x, y, z,
  }),
};

export const CAMERA_UNLOCKED_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: CAMERA_UNLOCKED,
};

export const PLAYER_MOVE_FORWARD_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_FORWARD,
  }),
};

export const PLAYER_MOVE_BACKWARD_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_BACK,
  }),
};

export const PLAYER_MOVE_LEFT_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_LEFT,
  }),
};

export const PLAYER_MOVE_RIGHT_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_RIGHT,
  }),
};

export const PLAYER_JUMP_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_JUMPED,
};

export const PLAYER_RUN_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_RUN,
  onEnd: PLAYER_STOPED_RUN,
};

export const CAMERA_LOCK_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: CAMERA_LOCKED,
};

export const TOGGLE_MENU_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: MENU_TOGGLED,
};

export const PLAYER_ATTACK_EVENT = {
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_ATTACKED,
  onEnd: PLAYER_STOPED_ATTACK,
};

export const PLAYER_PUT_BLOCK_EVENT = {
  type: INPUT_TYPE_ACTION,
  gameEvent: PLAYER_START_PUT_BLOCK,
};
