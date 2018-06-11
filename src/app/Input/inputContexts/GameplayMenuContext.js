// @flow
import InputContext from '../InputContext';
import { MOUSE_LEFT_BUTTON } from '../inputSources/MouseSource/rawEvents';
import { CAMERA_LOCK_EVENT } from '../events';

export default class GameplayMenuContext extends InputContext {
  active = true;

  constructor() {
    super();
    this.events.set(MOUSE_LEFT_BUTTON, CAMERA_LOCK_EVENT);
  }
}
