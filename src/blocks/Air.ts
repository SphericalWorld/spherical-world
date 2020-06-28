import type { BlockData } from './Block';
import Block from './Block';

const Air = (): BlockData =>
  Block({
    id: 0,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: true,
    needPhysics: false,
  });

export default Air;
