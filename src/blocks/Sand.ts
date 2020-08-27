import type { BlockData } from './Block';
import Block from './Block';
import { SAND } from '../engine/Texture/textureConstants';
import { sand } from '../../common/blocks/blocksInfo';

const Sand = (): BlockData =>
  Block(sand, {
    textures: {
      top: SAND,
      bottom: SAND,
      north: SAND,
      south: SAND,
      west: SAND,
      east: SAND,
    },
  });

export default Sand;
