import type { InputSource } from '../InputSource';
import MouseSource from './MouseSource';
import KeyboardSource from './KeyboardSource';
import type InputEvent from '../InputEvent';

const inputSourcesProvider = (dispatch: (event: InputEvent) => unknown): InputSource[] => [
  new MouseSource(dispatch),
  new KeyboardSource(dispatch),
];

export default inputSourcesProvider;
