import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { woodenSlab } from '../../common/blocks/blocksInfo';

const WoodenSlab = (): BlockData =>
  Block(woodenSlab, {
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
