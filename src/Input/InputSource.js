// @flow
import InputEvent from './InputEvent';

export interface InputSource {
  onEvent: (event: InputEvent) => any;
}
