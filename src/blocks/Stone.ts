import type { BlockData } from './Block';
import Block from './Block';
import { STONE } from '../engine/Texture/textureConstants';
import { stone } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: STONE },
    bottom: { texture: STONE },
    north: { texture: STONE },
    south: { texture: STONE },
    west: { texture: STONE },
    east: { texture: STONE },
  },
});

const Stone = (): BlockData =>
  Block(stone, {
    cube,
  });

export default Stone;
