import type { BlockData } from './Block';
import Block from './Block';
import { DIRT } from '../engine/Texture/textureConstants';
import { dirt } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: DIRT },
    bottom: { texture: DIRT },
    north: { texture: DIRT },
    south: { texture: DIRT },
    west: { texture: DIRT },
    east: { texture: DIRT },
  },
});

const Dirt = (): BlockData =>
  Block(dirt, {
    cube,
  });

export default Dirt;
