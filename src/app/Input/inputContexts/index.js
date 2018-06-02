// @flow
import InputContext from '../InputContext';
import GameplayMainContext from './GameplayMainContext';
import GameplayMenuContext from './GameplayMenuContext';

const inputContextsProvider = (): InputContext[] => [
  new GameplayMenuContext(),
  new GameplayMainContext(),
];

export default inputContextsProvider;
