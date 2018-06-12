// @flow
import {
  CAMERA_MOVED,
  CAMERA_UNLOCKED,
} from '../../player/events';
import InputContext from '../InputContext';
import {
  KEY_A,
  KEY_D,
  KEY_S,
  KEY_W,
  KEY_SPACE,
  KEY_ESCAPE,
} from '../inputSources/KeyboardSource/rawEvents';
import {
  MOUSE_MOVE,
  MOUSE_LEFT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
} from '../inputSources/MouseSource/rawEvents';

import {
  INPUT_TYPE_RANGE,
  INPUT_TYPE_ACTION,
  PLAYER_MOVE_FORWARD_EVENT,
  PLAYER_MOVE_BACKWARD_EVENT,
  PLAYER_MOVE_LEFT_EVENT,
  PLAYER_MOVE_RIGHT_EVENT,
  PLAYER_JUMP_EVENT,
  TOGGLE_MENU_EVENT,
} from '../events';

export default class GameplayMainContext extends InputContext {
  constructor() {
    super();
    this.events.set(MOUSE_MOVE, { type: INPUT_TYPE_RANGE, gameEvent: CAMERA_MOVED });
    this.events.set(MOUSE_POINTER_UNLOCKED, {
      type: INPUT_TYPE_ACTION,
      gameEvent: CAMERA_UNLOCKED,
    });
    this.events.set(KEY_W, PLAYER_MOVE_FORWARD_EVENT);
    this.events.set(KEY_S, PLAYER_MOVE_BACKWARD_EVENT);
    this.events.set(KEY_A, PLAYER_MOVE_LEFT_EVENT);
    this.events.set(KEY_D, PLAYER_MOVE_RIGHT_EVENT);
    this.events.set(KEY_SPACE, PLAYER_JUMP_EVENT);
    this.events.set(KEY_ESCAPE, TOGGLE_MENU_EVENT);
  }
}
