import type { InputSource } from '../../InputSource';
import StateInputEvent, { STATE_DOWN, STATE_UP } from '../../StateInputEvent';
import type InputEvent from '../../InputEvent';
import { KEY_ANY } from '../../../../common/constants/input/keyboardRawEvents';

export default class KeyboardSource implements InputSource {
  dispatch: (event: InputEvent) => unknown;
  pressedKeys: Set<string> = new Set();

  constructor(dispatch: (event: InputEvent) => unknown) {
    this.dispatch = dispatch;
    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));
  }

  onKeyDown(e: KeyboardEvent): void {
    const isPressed = this.pressedKeys.has(e.code);
    if (!isPressed) {
      this.dispatch(new StateInputEvent(e.code, STATE_DOWN));
      this.dispatch(new StateInputEvent(KEY_ANY, STATE_DOWN, e.code));
    }
    this.pressedKeys.add(e.code);
  }

  onKeyUp(e: KeyboardEvent): void {
    this.dispatch(new StateInputEvent(e.code, STATE_UP));
    this.pressedKeys.delete(e.code);
  }
}
