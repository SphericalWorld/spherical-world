// @flow
import type { InputSource } from '../../InputSource';
import StateInputEvent from '../../StateInputEvent';
import InputEvent from '../../InputEvent';

export default class KeyboardSource implements InputSource {
  onEvent: (event: InputEvent) => any;

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));
  }

  onKeyDown(e: KeyboardEvent) {
    this.onEvent(new StateInputEvent(e.code));
  }

  onKeyUp(e: KeyboardEvent) {
    this.onEvent(new StateInputEvent(e.code, true));
  }
}
