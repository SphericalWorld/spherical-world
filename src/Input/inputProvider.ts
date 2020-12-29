import { Input } from './Input';
import type { InputContext } from './InputContext';
import inputSourcesProvider from './inputSources';
import type InputEvent from './InputEvent';

export default (inputContexts: InputContext[]): Input => {
  const input = Input;
  input.setContexts(inputContexts);
  inputSourcesProvider((event: InputEvent) => input.onEvent(event));
  return input;
};
