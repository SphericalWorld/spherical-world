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
  SET_KEY_EVENT,
  TOGGLE_CRAFT_EVENT,
} from '../../common/constants/input/eventTypes';
import {
  INPUT_TYPE_RANGE,
  INPUT_TYPE_ACTION,
  INPUT_TYPE_STATE,
  CATEGORY_MOVEMENT,
  CATEGORY_INTERFACE,
  CATEGORY_COMBAT_AND_BLOCKS,
} from './eventTypes';
import type RangeInputEvent from './RangeInputEvent';
import { KEY_SELECT_BUTTON } from '../hud/hudConstants';
import {
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from '../player/events';
import {
  PREVIOUS_ITEM_SELECTED,
  NEXT_ITEM_SELECTED,
} from '../hud/components/MainPanel/mainPanelConstants';
import { GameEvent } from '../Events';
import type { MappedEvent } from './InputContext';

// TODO: move events to separate files

export const cameraMovedEvent = {
  action: CAMERA_MOVED_EVENT,
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.cameraMoved,
  data: ({ x, y, z }: RangeInputEvent) => ({
    x,
    y,
    z,
  }),
};

export const cameraUnlockedEvent = {
  action: CAMERA_UNLOCKED_EVENT,
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.cameraUnlocked,
};

export const playerMoveForwardEvent = {
  action: PLAYER_MOVE_FORWARD_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Forward',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerMoved,
  onEnd: GameEvent.playerStopedMove,
  data: () => ({
    direction: DIRECTION_FORWARD,
  }),
};

export const playerMoveBackwardEvent = {
  action: PLAYER_MOVE_BACKWARD_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Backward',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerMoved,
  onEnd: GameEvent.playerStopedMove,
  data: () => ({
    direction: DIRECTION_BACK,
  }),
};

export const playerMoveLeftEvent = {
  action: PLAYER_MOVE_LEFT_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Left',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerMoved,
  onEnd: GameEvent.playerStopedMove,
  data: () => ({
    direction: DIRECTION_LEFT,
  }),
};

export const playerMoveRightEvent = {
  action: PLAYER_MOVE_RIGHT_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Right',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerMoved,
  onEnd: GameEvent.playerStopedMove,
  data: () => ({
    direction: DIRECTION_RIGHT,
  }),
};

export const playerJumpEvent = {
  action: PLAYER_JUMP_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Jump',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerJumped,
  onEnd: GameEvent.playerStopedJump,
};

export const playerRunEvent = {
  action: PLAYER_RUN_EVENT,
  category: CATEGORY_MOVEMENT,
  caption: 'Run',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerRun,
  onEnd: GameEvent.playerStopedRun,
};

export const cameraLockEvent = {
  action: CAMERA_LOCK_EVENT,
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.cameraLocked,
};

export const toggleMenuEvent = {
  action: TOGGLE_MENU_EVENT,
  category: CATEGORY_INTERFACE,
  caption: 'Main menu',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.menuToggled,
};

export const toggleInventoryEvent = {
  action: TOGGLE_INVENTORY_EVENT,
  category: CATEGORY_INTERFACE,
  caption: 'Inventory',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.inventoryToggled,
};

export const selectNextItemEvent = {
  action: INVENTORY_NEXT_ITEM,
  category: CATEGORY_INTERFACE,
  caption: 'Select next item',
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.nextItemSelected,
  uiEvent: {
    type: NEXT_ITEM_SELECTED,
  },
};

export const selectPreviousItemEvent = {
  action: INVENTORY_PREVIOUS_ITEM,
  category: CATEGORY_INTERFACE,
  caption: 'Select previous item',
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.previousItemSelected,
  uiEvent: {
    type: PREVIOUS_ITEM_SELECTED,
  },
};

export const playerAttackEvent = {
  action: PLAYER_ATTACK_EVENT,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Attack / Destroy block',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerAttacked,
  onEnd: GameEvent.playerStopedAttack,
};

export const playerPutBlockEvent = {
  action: PLAYER_PUT_BLOCK_EVENT,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Put Block',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.playerTriedPutBlock,
};

export const keySetEvent = {
  action: SET_KEY_EVENT,
  type: INPUT_TYPE_ACTION,
  gameEvent: KEY_SELECT_BUTTON,
  data: ({ data }: { data: string }) => data,
  uiEvent: ({ payload }: { data: string }) => ({ type: 'KEY_SELECT_BUTTON', payload }),
};

export const toggleCraftEvent: MappedEvent = {
  action: TOGGLE_CRAFT_EVENT,
  category: CATEGORY_INTERFACE,
  caption: 'Craft',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.craftToggled,
};
