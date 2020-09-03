import type { BlockData } from './Block';
import Block from './Block';
import { OAK_LEAVES } from '../engine/Texture/textureConstants';
import { oakLeaves } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: OAK_LEAVES,
    bottom: OAK_LEAVES,
    north: OAK_LEAVES,
    south: OAK_LEAVES,
    west: OAK_LEAVES,
    east: OAK_LEAVES,
  },
});

const OakLeaves = (): BlockData =>
  Block(oakLeaves, {
    model,
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
