import InputEvent from './InputEvent';

export const STATE_DOWN: 0 = 0;
export const STATE_UP: 1 = 1;

export type BUTTON_STATUS =
  | typeof STATE_DOWN
  | typeof STATE_UP;

export default class StateInputEvent extends InputEvent {
  status: BUTTON_STATUS;
  data: unknown;

  constructor(name: string, status: BUTTON_STATUS = 0, data: unknown) {
    super(name);
    this.status = status;
    this.data = data;
  }
}
