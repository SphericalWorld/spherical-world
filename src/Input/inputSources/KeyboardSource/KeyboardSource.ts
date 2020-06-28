import type { InputSource } from '../../InputSource';
import StateInputEvent, { STATE_DOWN, STATE_UP } from '../../StateInputEvent';
import InputEvent from '../../InputEvent';
import { KEY_ANY } from '../../../../common/constants/input/keyboardRawEvents';

export default class KeyboardSource implements InputSource {
  onEvent: (event: InputEvent) => unknown;
  pressedKeys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));
  }

  onKeyDown(e: KeyboardEvent): void {
    const isPressed = this.pressedKeys.has(e.code);
    if (!isPressed) {
      this.onEvent(new StateInputEvent(e.code, STATE_DOWN));
      this.onEvent(new StateInputEvent(KEY_ANY, STATE_DOWN, e.code));
    }
    this.pressedKeys.add(e.code);
  }

  onKeyUp(e: KeyboardEvent): void {
    this.onEvent(new StateInputEvent(e.code, STATE_UP));
    this.pressedKeys.delete(e.code);
  }
}
