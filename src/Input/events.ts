import { InputEvent } from '../../common/constants/input/eventTypes';
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
  action: InputEvent.cameraMoved,
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.cameraMoved,
  data: ({ x, y, z }: RangeInputEvent) => ({
    x,
    y,
    z,
  }),
};

export const cameraUnlockedEvent = {
  action: InputEvent.cameraUnlocked,
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.cameraUnlocked,
};

export const playerMoveForwardEvent = {
  action: InputEvent.playerMoveForward,
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
  action: InputEvent.playerMoveBackward,
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
  action: InputEvent.playerMoveLeft,
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
  action: InputEvent.playerMoveRight,
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
  action: InputEvent.playerJump,
  category: CATEGORY_MOVEMENT,
  caption: 'Jump',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerJumped,
  onEnd: GameEvent.playerStopedJump,
};

export const playerRunEvent = {
  action: InputEvent.playerRun,
  category: CATEGORY_MOVEMENT,
  caption: 'Run',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerRun,
  onEnd: GameEvent.playerStopedRun,
};

export const cameraLockEvent = {
  action: InputEvent.cameraLock,
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.cameraLocked,
};

export const toggleMenuEvent = {
  action: InputEvent.toggleMenu,
  category: CATEGORY_INTERFACE,
  caption: 'Main menu',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.menuToggled,
};

export const toggleInventoryEvent = {
  action: InputEvent.toggleInventory,
  category: CATEGORY_INTERFACE,
  caption: 'Inventory',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.inventoryToggled,
};

export const selectNextItemEvent = {
  action: InputEvent.inventoryNextItem,
  category: CATEGORY_INTERFACE,
  caption: 'Select next item',
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.nextItemSelected,
  uiEvent: {
    type: NEXT_ITEM_SELECTED,
  },
};

export const selectPreviousItemEvent = {
  action: InputEvent.inventoryPreviousItem,
  category: CATEGORY_INTERFACE,
  caption: 'Select previous item',
  type: INPUT_TYPE_RANGE,
  gameEvent: GameEvent.previousItemSelected,
  uiEvent: {
    type: PREVIOUS_ITEM_SELECTED,
  },
};

export const playerAttackEvent = {
  action: InputEvent.playerAttack,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Attack / Destroy block',
  type: INPUT_TYPE_STATE,
  gameEvent: GameEvent.playerAttacked,
  onEnd: GameEvent.playerStopedAttack,
};

export const playerPutBlockEvent = {
  action: InputEvent.playerPutBlock,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Put Block',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.playerTriedPutBlock,
};

export const keySetEvent = {
  action: InputEvent.setKey,
  type: INPUT_TYPE_ACTION,
  gameEvent: KEY_SELECT_BUTTON,
  data: ({ data }: { data: string }) => data,
  uiEvent: ({ payload }: { data: string }) => ({ type: 'KEY_SELECT_BUTTON', payload }),
};

export const toggleCraftEvent: MappedEvent = {
  action: InputEvent.toggleCraft,
  category: CATEGORY_INTERFACE,
  caption: 'Craft',
  type: INPUT_TYPE_ACTION,
  gameEvent: GameEvent.craftToggled,
};
