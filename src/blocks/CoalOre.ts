import type { BlockData } from './Block';
import Block from './Block';
import { COAL_ORE } from '../engine/Texture/textureConstants';
import { coalOre } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: COAL_ORE },
    bottom: { texture: COAL_ORE },
    north: { texture: COAL_ORE },
    south: { texture: COAL_ORE },
    west: { texture: COAL_ORE },
    east: { texture: COAL_ORE },
  },
});

const CoalOre = (): BlockData =>
  Block(coalOre, {
    cube,
  });

export default CoalOre;
