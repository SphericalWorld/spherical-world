import type { BlockData } from './Block';
import Block from './Block';
import { CLAY } from '../engine/Texture/textureConstants';
import { clay } from '../../common/blocks/blocksInfo';

const Clay = (): BlockData =>
  Block(clay, {
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
