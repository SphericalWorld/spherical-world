// @flow strict
import {
  CAMERA_MOVED_EVENT,
  CAMERA_UNLOCKED_EVENT,
  PLAYER_MOVE_FORWARD_EVENT,
  PLAYER_MOVE_BACKWARD_EVENT,
  PLAYER_MOVE_LEFT_EVENT,
  PLAYER_MOVE_RIGHT_EVENT,
  PLAYER_JUMP_EVENT,
  PLAYER_RUN_EVENT,
  CAMERA_LOCK_EVENT,
  TOGGLE_MENU_EVENT,
  TOGGLE_INVENTORY_EVENT,
  INVENTORY_NEXT_ITEM,
  INVENTORY_PREVIOUS_ITEM,
  PLAYER_ATTACK_EVENT,
  PLAYER_PUT_BLOCK_EVENT,
} from '../../common/constants/input/eventTypes';
import {
  INPUT_TYPE_RANGE,
  INPUT_TYPE_ACTION,
  INPUT_TYPE_STATE,
  CATEGORY_MOVEMENT,
  CATEGORY_INTERFACE,
  CATEGORY_COMBAT_AND_BLOCKS,
} from './eventTypes';
import RangeInputEvent from './RangeInputEvent';
import { MENU_TOGGLED, INVENTORY_TOGGLED } from '../hud/hudConstants';
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
  PLAYER_STOPED_JUMP,
  PLAYER_RUN,
  PLAYER_STOPED_RUN,
  PLAYER_ATTACKED,
  PLAYER_STOPED_ATTACK,
  PLAYER_START_PUT_BLOCK,
} from '../player/events';
import { PREVIOUS_ITEM_SELECTED, NEXT_ITEM_SELECTED } from '../hud/components/MainPanel/mainPanelConstants';

// TODO: move events to separate files

export const cameraMovedEvent = {
  action: CAMERA_MOVED_EVENT,
  type: INPUT_TYPE_RANGE,
  gameEvent: CAMERA_MOVED,
  data: ({ x, y, z }: RangeInputEvent) => ({
    x, y, z,
  }),
};

export const cameraUnlockedEvent = {
  action: CAMERA_UNLOCKED_EVENT,
  type: INPUT_TYPE_ACTION,
  gameEvent: CAMERA_UNLOCKED,
};

export const playerMoveForwardEvent = {
  action: PLAYER_MOVE_FORWARD_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Forward',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_FORWARD,
  }),
};

export const playerMoveBackwardEvent = {
  action: PLAYER_MOVE_BACKWARD_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Backward',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_BACK,
  }),
};

export const playerMoveLeftEvent = {
  action: PLAYER_MOVE_LEFT_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Left',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_LEFT,
  }),
};

export const playerMoveRightEvent = {
  action: PLAYER_MOVE_RIGHT_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Right',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_MOVED,
  onEnd: PLAYER_STOPED_MOVE,
  data: () => ({
    direction: DIRECTION_RIGHT,
  }),
};

export const playerJumpEvent = {
  action: PLAYER_JUMP_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Jump',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_JUMPED,
  onEnd: PLAYER_STOPED_JUMP,
};

export const playerRunEvent = {
  action: PLAYER_RUN_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Run',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_RUN,
  onEnd: PLAYER_STOPED_RUN,
};

export const cameraLockEvent = {
  action: CAMERA_LOCK_EVENT,
  type: INPUT_TYPE_ACTION,
  gameEvent: CAMERA_LOCKED,
};

export const toggleMenuEvent = {
  action: TOGGLE_MENU_EVENT,
  category: CATEGORY_INTERFACE,
  caption: 'Main menu',
  type: INPUT_TYPE_ACTION,
  gameEvent: MENU_TOGGLED,
};

export const toggleInventoryEvent = {
  action: TOGGLE_INVENTORY_EVENT,
  category: CATEGORY_INTERFACE,
  caption: 'Inventory',
  type: INPUT_TYPE_ACTION,
  gameEvent: INVENTORY_TOGGLED,
};

export const selectNextItemEvent = {
  action: INVENTORY_NEXT_ITEM,
  category: CATEGORY_INTERFACE,
  caption: 'Select next item',
  type: INPUT_TYPE_RANGE,
  gameEvent: NEXT_ITEM_SELECTED,
};

export const selectPreviousItemEvent = {
  action: INVENTORY_PREVIOUS_ITEM,
  category: CATEGORY_INTERFACE,
  caption: 'Select previous item',
  type: INPUT_TYPE_RANGE,
  gameEvent: PREVIOUS_ITEM_SELECTED,
};

export const playerAttackEvent = {
  action: PLAYER_ATTACK_EVENT,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Attack / Destroy block',
  type: INPUT_TYPE_STATE,
  gameEvent: PLAYER_ATTACKED,
  onEnd: PLAYER_STOPED_ATTACK,
};

export const playerPutBlockEvent = {
  action: PLAYER_PUT_BLOCK_EVENT,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Put Block',
  type: INPUT_TYPE_ACTION,
  gameEvent: PLAYER_START_PUT_BLOCK,
};
