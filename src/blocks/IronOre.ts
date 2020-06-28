import type { BlockData } from './Block';
import Block from './Block';
import { IRON_ORE } from '../engine/Texture/textureConstants';

const IronOre = (): BlockData =>
  Block({
    id: 9,
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
