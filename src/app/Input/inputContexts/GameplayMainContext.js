// @flow
import InputContext from '../InputContext';
import {
  KEY_A,
  KEY_D,
  KEY_S,
  KEY_W,
  KEY_SPACE,
  KEY_ESCAPE,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_SHIFT_LEFT,
} from '../inputSources/KeyboardSource/rawEvents';
import {
  MOUSE_MOVE,
  MOUSE_LEFT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
} from '../inputSources/MouseSource/rawEvents';

import {
  PLAYER_MOVE_FORWARD_EVENT,
  PLAYER_MOVE_BACKWARD_EVENT,
  PLAYER_MOVE_LEFT_EVENT,
  PLAYER_MOVE_RIGHT_EVENT,
  PLAYER_JUMP_EVENT,
  TOGGLE_MENU_EVENT,
  CAMERA_UNLOCKED_EVENT,
  CAMERA_MOVED_EVENT,
  PLAYER_RUN_EVENT,
  PLAYER_ATTACK_EVENT,
} from '../events';

export default class GameplayMainContext extends InputContext {
  constructor() {
    super();
    this.events.set(MOUSE_LEFT_BUTTON, PLAYER_ATTACK_EVENT);
    this.events.set(MOUSE_MOVE, CAMERA_MOVED_EVENT);
    this.events.set(MOUSE_POINTER_UNLOCKED, CAMERA_UNLOCKED_EVENT);
    this.events.set(KEY_W, PLAYER_MOVE_FORWARD_EVENT);
    this.events.set(KEY_S, PLAYER_MOVE_BACKWARD_EVENT);
    this.events.set(KEY_A, PLAYER_MOVE_LEFT_EVENT);
    this.events.set(KEY_D, PLAYER_MOVE_RIGHT_EVENT);
    this.events.set(KEY_ARROW_UP, PLAYER_MOVE_FORWARD_EVENT);
    this.events.set(KEY_ARROW_DOWN, PLAYER_MOVE_BACKWARD_EVENT);
    this.events.set(KEY_ARROW_LEFT, PLAYER_MOVE_LEFT_EVENT);
    this.events.set(KEY_ARROW_RIGHT, PLAYER_MOVE_RIGHT_EVENT);

    this.events.set(KEY_SHIFT_LEFT, PLAYER_RUN_EVENT);
    this.events.set(KEY_SPACE, PLAYER_JUMP_EVENT);
    this.events.set(KEY_ESCAPE, TOGGLE_MENU_EVENT);
  }
}
