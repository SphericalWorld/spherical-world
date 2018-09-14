// @flow
import type { InputSource } from '../../InputSource';
import StateInputEvent, { STATE_DOWN, STATE_UP } from '../../StateInputEvent';
import InputEvent from '../../InputEvent';

export default class KeyboardSource implements InputSource {
  onEvent: (event: InputEvent) => any;
  pressedKeys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));
  }

  onKeyDown(e: KeyboardEvent) {
    const isPressed = this.pressedKeys.has(e.code);
    if (!isPressed) {
      this.onEvent(new StateInputEvent(e.code, STATE_DOWN));
    }
    this.pressedKeys.add(e.code);
  }

  onKeyUp(e: KeyboardEvent) {
    this.onEvent(new StateInputEvent(e.code, STATE_UP));
    this.pressedKeys.delete(e.code);
  }
}
