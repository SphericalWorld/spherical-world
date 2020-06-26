import type { InputContext } from '../InputContext';
import { createContext } from '../InputContext';
import { keySetEvent } from '../events';

export const KEY_BINDING_CONTEXT: 'KEY_BINDING_CONTEXT' = 'KEY_BINDING_CONTEXT';

const createGameplayMenuContext = (): InputContext => createContext({
  type: KEY_BINDING_CONTEXT,
  active: false,
  eventTypes: [
    keySetEvent,
  ],
});

export default createGameplayMenuContext;
