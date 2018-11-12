// @flow
import type { Input } from './Input';
import type { InputSource } from './InputSource';
import type { InputContext } from './InputContext';
import inputProvider from './Input';

export default (inputSources: InputSource[], inputContexts: InputContext[]): Input => {
  const InputClass = inputProvider(inputContexts);
  const instance = new InputClass();
  instance.addEventSource(...inputSources);
  return instance;
};
