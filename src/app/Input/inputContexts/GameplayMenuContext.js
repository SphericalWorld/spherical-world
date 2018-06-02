// @flow
import {
  CAMERA_LOCKED,
} from '../../player/events';
import InputContext from '../InputContext';
import {
  MOUSE_LEFT_BUTTON,
} from '../inputSources/MouseSource/rawEvents';

import { INPUT_TYPE_ACTION } from '../events';

export default class GameplayMenuContext extends InputContext {
  active = true;

  constructor() {
    super();
    this.events.set(MOUSE_LEFT_BUTTON, {
      type: INPUT_TYPE_ACTION,
      gameEvent: CAMERA_LOCKED,
    });
  }
}
