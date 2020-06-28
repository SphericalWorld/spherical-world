import type { InputContext } from '../InputContext';
import { createContext } from '../InputContext';
import { cameraLockEvent, toggleMenuEvent } from '../events';

export const GAMEPLAY_MENU_CONTEXT: 'GAMEPLAY_MENU_CONTEXT' = 'GAMEPLAY_MENU_CONTEXT';

const createGameplayMenuContext = (): InputContext =>
  createContext({
    type: GAMEPLAY_MENU_CONTEXT,
    active: true,
    eventTypes: [cameraLockEvent, toggleMenuEvent],
  });

export default createGameplayMenuContext;
