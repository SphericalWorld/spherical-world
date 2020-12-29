import type { InputContext } from '../InputContext';
import createGameplayMainContext, { GAMEPLAY_MAIN_CONTEXT } from './GameplayMainContext';
import createGameplayMenuContext, { GAMEPLAY_MENU_CONTEXT } from './GameplayMenuContext';

export type InputContexts = typeof GAMEPLAY_MAIN_CONTEXT | typeof GAMEPLAY_MENU_CONTEXT;

const inputContextsProvider = (): InputContext[] => [
  createGameplayMenuContext(),
  createGameplayMainContext(),
];

export { GAMEPLAY_MAIN_CONTEXT, GAMEPLAY_MENU_CONTEXT };
export default inputContextsProvider;
