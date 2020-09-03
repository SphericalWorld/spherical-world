import type { BlockData } from './Block';
import Block from './Block';
import { IRON_ORE } from '../engine/Texture/textureConstants';
import { ironOre } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: IRON_ORE },
    bottom: { texture: IRON_ORE },
    north: { texture: IRON_ORE },
    south: { texture: IRON_ORE },
    west: { texture: IRON_ORE },
    east: { texture: IRON_ORE },
  },
});

const IronOre = (): BlockData =>
  Block(ironOre, {
    cube,
  });

export default IronOre;
