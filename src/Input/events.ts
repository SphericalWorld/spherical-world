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
};

export const playerMoveForwardEvent = {
  action: InputEvent.playerMoveForward,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Forward',
  type: INPUT_TYPE_STATE,
};

export const playerMoveBackwardEvent = {
  action: InputEvent.playerMoveBackward,
  category: CATEGORY_MOVEMENT,
  caption: 'Move Backward',
  type: INPUT_TYPE_STATE,
};

export const playerMoveLeftEvent = {
  action: InputEvent.playerMoveLeft,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Left',
  type: INPUT_TYPE_STATE,
};

export const playerMoveRightEvent = {
  action: InputEvent.playerMoveRight,
  category: CATEGORY_MOVEMENT,
  caption: 'Strafe Right',
  type: INPUT_TYPE_STATE,
};

export const playerJumpEvent = {
  action: InputEvent.playerJump,
  category: CATEGORY_MOVEMENT,
  caption: 'Jump',
  type: INPUT_TYPE_STATE,
};

export const playerRunEvent = {
  action: InputEvent.playerRun,
  category: CATEGORY_MOVEMENT,
  caption: 'Run',
  type: INPUT_TYPE_STATE,
};

export const cameraLockEvent = {
  action: InputEvent.cameraLock,
  type: INPUT_TYPE_ACTION,
};

export const toggleMenuEvent = {
  action: InputEvent.toggleMenu,
  category: CATEGORY_INTERFACE,
  caption: 'Main menu',
  type: INPUT_TYPE_ACTION,
};

export const toggleInventoryEvent = {
  action: InputEvent.toggleInventory,
  category: CATEGORY_INTERFACE,
  caption: 'Inventory',
  type: INPUT_TYPE_ACTION,
};

export const selectNextItemEvent = {
  action: InputEvent.inventoryNextItem,
  category: CATEGORY_INTERFACE,
  caption: 'Select next item',
  type: INPUT_TYPE_RANGE,
};

export const selectPreviousItemEvent = {
  action: InputEvent.inventoryPreviousItem,
  category: CATEGORY_INTERFACE,
  caption: 'Select previous item',
  type: INPUT_TYPE_RANGE,
};

export const playerAttackEvent = {
  action: InputEvent.playerAttack,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Attack / Destroy block',
  type: INPUT_TYPE_STATE,
};

export const playerPutBlockEvent = {
  action: InputEvent.playerPutBlock,
  category: CATEGORY_COMBAT_AND_BLOCKS,
  caption: 'Put Block',
  type: INPUT_TYPE_ACTION,
};

export const toggleCraftEvent: MappedEvent = {
  action: InputEvent.toggleCraft,
  category: CATEGORY_INTERFACE,
  caption: 'Craft',
  type: INPUT_TYPE_ACTION,
};
