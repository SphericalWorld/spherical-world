// @flow
import InputEvent from './InputEvent';

export default class StateInputEvent extends InputEvent {
  isEnded: boolean;

  constructor(name: string, isEnded: boolean = false) {
    super(name);
    this.isEnded = isEnded;
  }
}
