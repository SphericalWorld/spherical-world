import type { BlockData } from './Block';
import Block from './Block';
import { IRON_ORE } from '../engine/Texture/textureConstants';
import { ironOre } from '../../common/blocks/blocksInfo';

const IronOre = (): BlockData =>
  Block(ironOre, {
    textures: {
      top: IRON_ORE,
      bottom: IRON_ORE,
      north: IRON_ORE,
      south: IRON_ORE,
      west: IRON_ORE,
      east: IRON_ORE,
    },
  });

export default IronOre;
