import type InputEvent from './InputEvent';

export interface InputSource {
  dispatch: (event: InputEvent) => unknown;
}
