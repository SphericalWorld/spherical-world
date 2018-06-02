// @flow
import type { InputSource } from './InputSource';
import InputContext from './InputContext';
import inputProvider, { Input } from './Input';

export default (inputSources: InputSource[], inputContexts: InputContext[]): Input => {
  const InputClass = inputProvider(inputContexts);
  const instance = new InputClass();
  instance.addEventSource(...inputSources);
  return instance;
};
