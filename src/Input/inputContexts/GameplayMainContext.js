// @flow strict
import type { InputContext } from '../InputContext';
import { createContext } from '../InputContext';
import {
  playerAttackEvent,
  playerPutBlockEvent,
  cameraMovedEvent,
  cameraUnlockedEvent,
  playerMoveForwardEvent,
  playerMoveBackwardEvent,
  playerMoveLeftEvent,
  playerMoveRightEvent,
  playerRunEvent,
  playerJumpEvent,
  toggleMenuEvent,
  toggleInventoryEvent,
  selectNextItemEvent,
  selectPreviousItemEvent,
} from '../events';

export const GAMEPLAY_MAIN_CONTEXT: 'GAMEPLAY_MAIN_CONTEXT' = 'GAMEPLAY_MAIN_CONTEXT';

const createGameplayMainContext = (): InputContext => createContext({
  type: GAMEPLAY_MAIN_CONTEXT,
  active: false,
  eventTypes: [
    playerAttackEvent,
    playerPutBlockEvent,
    cameraMovedEvent,
    cameraUnlockedEvent,
    playerMoveForwardEvent,
    playerMoveBackwardEvent,
    playerMoveLeftEvent,
    playerMoveRightEvent,

    playerRunEvent,
    playerJumpEvent,
    toggleMenuEvent,
    toggleInventoryEvent,
    selectNextItemEvent,
    selectPreviousItemEvent,
  ],
});

export default createGameplayMainContext;
