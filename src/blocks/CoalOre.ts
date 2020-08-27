import type { BlockData } from './Block';
import Block from './Block';
import { COAL_ORE } from '../engine/Texture/textureConstants';
import { coalOre } from '../../common/blocks/blocksInfo';

const CoalOre = (): BlockData =>
  Block(coalOre, {
    textures: {
      top: COAL_ORE,
      bottom: COAL_ORE,
      north: COAL_ORE,
      south: COAL_ORE,
      west: COAL_ORE,
      east: COAL_ORE,
    },
  });

export default CoalOre;
