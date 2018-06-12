// @flow
import InputContext from '../InputContext';
import { KEY_ESCAPE } from '../inputSources/KeyboardSource/rawEvents';
import { MOUSE_LEFT_BUTTON } from '../inputSources/MouseSource/rawEvents';
import { CAMERA_LOCK_EVENT, TOGGLE_MENU_EVENT } from '../events';

export default class GameplayMenuContext extends InputContext {
  active = true;

  constructor() {
    super();
    this.events.set(MOUSE_LEFT_BUTTON, CAMERA_LOCK_EVENT);
    this.events.set(KEY_ESCAPE, TOGGLE_MENU_EVENT);
  }
}
