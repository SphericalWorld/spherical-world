import type { InputSource } from '../InputSource';
import MouseSource from './MouseSource';
import KeyboardSource from './KeyboardSource';

const inputSourcesProvider = (): InputSource[] => [
  new MouseSource(),
  new KeyboardSource(),
];

export default inputSourcesProvider;
