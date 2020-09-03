import type { BlockData } from './Block';
import Block from './Block';
import { CLAY } from '../engine/Texture/textureConstants';
import { clay } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: CLAY },
    bottom: { texture: CLAY },
    north: { texture: CLAY },
    south: { texture: CLAY },
    west: { texture: CLAY },
    east: { texture: CLAY },
  },
});

const Clay = (): BlockData =>
  Block(clay, {
    cube,
  });

export default Clay;
