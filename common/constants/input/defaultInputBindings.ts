import { InputEvent } from './eventTypes';
import {
  KEY_UNBOUND,
  KEY_A,
  KEY_D,
  KEY_I,
  KEY_S,
  KEY_W,
  KEY_SPACE,
  KEY_ESCAPE,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_SHIFT_LEFT,
  KEY_ANY,
  KEY_T,
} from './keyboardRawEvents';

import {
  MOUSE_MOVE,
  MOUSE_LEFT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
  MOUSE_RIGHT_BUTTON,
  MOUSE_WHEEL_UP,
  MOUSE_WHEEL_DOWN,
} from './mouseRawEvents';
import type { InputRawEvents } from './rawEvents';

export const defaultInputBindings: ReadonlyArray<[InputEvent, InputRawEvents, InputRawEvents]> = [
  [InputEvent.cameraLock, MOUSE_LEFT_BUTTON, KEY_UNBOUND],
  [InputEvent.toggleMenu, KEY_ESCAPE, KEY_UNBOUND],

  [InputEvent.playerAttack, MOUSE_LEFT_BUTTON, KEY_UNBOUND],
  [InputEvent.playerPutBlock, MOUSE_RIGHT_BUTTON, KEY_UNBOUND],
  [InputEvent.cameraMoved, MOUSE_MOVE, KEY_UNBOUND],
  [InputEvent.cameraUnlocked, MOUSE_POINTER_UNLOCKED, KEY_UNBOUND],
  [InputEvent.playerMoveForward, KEY_W, KEY_ARROW_UP],
  [InputEvent.playerMoveBackward, KEY_S, KEY_ARROW_DOWN],
  [InputEvent.playerMoveLeft, KEY_A, KEY_ARROW_LEFT],
  [InputEvent.playerMoveRight, KEY_D, KEY_ARROW_RIGHT],
  [InputEvent.playerRun, KEY_SHIFT_LEFT, KEY_UNBOUND],
  [InputEvent.playerJump, KEY_SPACE, KEY_UNBOUND],
  [InputEvent.toggleInventory, KEY_I, KEY_UNBOUND],
  [InputEvent.inventoryNextItem, MOUSE_WHEEL_UP, KEY_UNBOUND],
  [InputEvent.inventoryPreviousItem, MOUSE_WHEEL_DOWN, KEY_UNBOUND],
  [InputEvent.setKey, KEY_ANY, KEY_UNBOUND],
  [InputEvent.toggleCraft, KEY_T, KEY_UNBOUND],
];
