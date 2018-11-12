// @flow strict
import type InputEvent from './InputEvent';

export interface InputSource {
  onEvent: (event: InputEvent) => mixed;
}
