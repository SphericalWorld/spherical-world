// @flow
import type { InputContext } from '../InputContext';
import { createContext } from '../InputContext';
import { CAMERA_LOCK_EVENT, TOGGLE_MENU_EVENT } from '../events';

export const GAMEPLAY_MENU_CONTEXT: 'GAMEPLAY_MENU_CONTEXT' = 'GAMEPLAY_MENU_CONTEXT';

const createGameplayMenuContext = (): InputContext => createContext({
  type: GAMEPLAY_MENU_CONTEXT,
  active: true,
  eventTypes: [
    CAMERA_LOCK_EVENT,
    TOGGLE_MENU_EVENT,
  ],
});

export default createGameplayMenuContext;
