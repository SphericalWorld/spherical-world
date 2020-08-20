import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { WOODEN_SLAB } from '../../common/blocks';

const WoodenSlab = (): BlockData =>
  Block({
    id: WOODEN_SLAB,
    textures: {
      top: PLANKS_OAK,
      bottom: PLANKS_OAK,
      north: PLANKS_OAK,
      south: PLANKS_OAK,
      west: PLANKS_OAK,
      east: PLANKS_OAK,
    },
    isSlab: true,
  });

export default WoodenSlab;
