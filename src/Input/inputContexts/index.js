// @flow
import type { InputContext } from '../InputContext';
import createGameplayMainContext from './GameplayMainContext';
import createGameplayMenuContext from './GameplayMenuContext';

const inputContextsProvider = (): InputContext[] => [
  createGameplayMenuContext(),
  createGameplayMainContext(),
];

export default inputContextsProvider;
