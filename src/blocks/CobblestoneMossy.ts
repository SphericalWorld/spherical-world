import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_COBBLESTONE_MOSSY } from '../engine/Texture/textureConstants';
import { cobblestoneMossy } from '../../common/blocks/blocksInfo';

const CobblestoneMossy = (): BlockData =>
  Block(cobblestoneMossy, {
    textures: {
      top: TEXTURE_COBBLESTONE_MOSSY,
      bottom: TEXTURE_COBBLESTONE_MOSSY,
      north: TEXTURE_COBBLESTONE_MOSSY,
      south: TEXTURE_COBBLESTONE_MOSSY,
      west: TEXTURE_COBBLESTONE_MOSSY,
      east: TEXTURE_COBBLESTONE_MOSSY,
    },
  });

export default CobblestoneMossy;
