import type { BlockData } from './Block';
import Block from './Block';
import { OAK_LEAVES } from '../engine/Texture/textureConstants';
import { oakLeaves } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: OAK_LEAVES },
    bottom: { texture: OAK_LEAVES },
    north: { texture: OAK_LEAVES },
    south: { texture: OAK_LEAVES },
    west: { texture: OAK_LEAVES },
    east: { texture: OAK_LEAVES },
  },
});

const OakLeaves = (): BlockData =>
  Block(oakLeaves, {
    cube,
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },
  });

export default OakLeaves;
