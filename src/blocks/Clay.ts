import type { BlockData } from './Block';
import Block from './Block';
import { CLAY } from '../engine/Texture/textureConstants';

const Clay = (): BlockData =>
  Block({
    id: 7,
    textures: {
      top: CLAY,
      bottom: CLAY,
      north: CLAY,
      south: CLAY,
      west: CLAY,
      east: CLAY,
    },
  });

export default Clay;
