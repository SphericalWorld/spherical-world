// @flow
import InputEvent from './InputEvent';

export const STATE_DOWN = 0;
export const STATE_UP = 1;
export const STATE_PRESSED = 2;

export type BUTTON_STATUS =
  | typeof STATE_DOWN
  | typeof STATE_UP
  | typeof STATE_PRESSED;

export default class StateInputEvent extends InputEvent {
  status: BUTTON_STATUS;

  constructor(name: string, status: BUTTON_STATUS = 0) {
    super(name);
    this.status = status;
  }
}
