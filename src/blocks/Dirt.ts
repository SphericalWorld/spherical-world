import type { BlockData } from './Block';
import Block from './Block';
import { DIRT } from '../engine/Texture/textureConstants';
import { dirt } from '../../common/blocks/blocksInfo';

const Dirt = (): BlockData =>
  Block(dirt, {
    textures: {
      top: DIRT,
      bottom: DIRT,
      north: DIRT,
      south: DIRT,
      west: DIRT,
      east: DIRT,
    },
  });

export default Dirt;
