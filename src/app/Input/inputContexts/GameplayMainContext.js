// @flow
import {
  CAMERA_MOVED,
  CAMERA_UNLOCKED,
  PLAYER_MOVED,
  PLAYER_STOPED_MOVE,
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT
} from '../../player/events';
import InputContext from '../InputContext';
import {
  KEY_A,
  KEY_D,
  KEY_S,
  KEY_W,
} from '../inputSources/KeyboardSource/rawEvents';
import {
  MOUSE_MOVE,
  MOUSE_LEFT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
} from '../inputSources/MouseSource/rawEvents';

import {
  INPUT_TYPE_RANGE,
  INPUT_TYPE_ACTION,
  INPUT_TYPE_STATE,
} from '../events';

export default class GameplayMainContext extends InputContext {
  constructor() {
    super();
    this.events.set(MOUSE_MOVE, { type: INPUT_TYPE_RANGE, gameEvent: CAMERA_MOVED });
    this.events.set(MOUSE_POINTER_UNLOCKED, {
      type: INPUT_TYPE_ACTION,
      gameEvent: CAMERA_UNLOCKED,
    });
    this.events.set(KEY_W, {
      type: INPUT_TYPE_STATE,
      gameEvent: PLAYER_MOVED,
      onEnd: PLAYER_STOPED_MOVE,
      data: {
        direction: DIRECTION_FORWARD,
      },
    });
    this.events.set(KEY_S, {
      type: INPUT_TYPE_STATE,
      gameEvent: PLAYER_MOVED,
      onEnd: PLAYER_STOPED_MOVE,
      data: {
        direction: DIRECTION_BACK,
      },
    });
    this.events.set(KEY_A, {
      type: INPUT_TYPE_STATE,
      gameEvent: PLAYER_MOVED,
      onEnd: PLAYER_STOPED_MOVE,
      data: {
        direction: DIRECTION_LEFT,
      },
    });
    this.events.set(KEY_D, {
      type: INPUT_TYPE_STATE,
      gameEvent: PLAYER_MOVED,
      onEnd: PLAYER_STOPED_MOVE,
      data: {
        direction: DIRECTION_RIGHT,
      },
    });
  }
}
