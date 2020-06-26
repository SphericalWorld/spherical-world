import type { InputContext } from '../InputContext';
import createGameplayMainContext, {
  GAMEPLAY_MAIN_CONTEXT,
} from './GameplayMainContext';
import createGameplayMenuContext, {
  GAMEPLAY_MENU_CONTEXT,
} from './GameplayMenuContext';
import createKeyBindingContext, {
  KEY_BINDING_CONTEXT,
} from './KeyBindingContext';

export type InputContexts =
  | typeof GAMEPLAY_MAIN_CONTEXT
  | typeof GAMEPLAY_MENU_CONTEXT
  | typeof KEY_BINDING_CONTEXT;

const inputContextsProvider = (): InputContext[] => [
  createGameplayMenuContext(),
  createGameplayMainContext(),
  createKeyBindingContext(),
];

export { GAMEPLAY_MAIN_CONTEXT, GAMEPLAY_MENU_CONTEXT, KEY_BINDING_CONTEXT };
export default inputContextsProvider;
