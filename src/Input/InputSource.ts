import type InputEvent from './InputEvent';

export interface InputSource {
  onEvent: (event: InputEvent) => unknown;
}
