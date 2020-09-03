import type { BlockData } from './Block';
import Block from './Block';
import { STONE } from '../engine/Texture/textureConstants';
import { stone } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: STONE,
    bottom: STONE,
    north: STONE,
    south: STONE,
    west: STONE,
    east: STONE,
  },
});

const Stone = (): BlockData =>
  Block(stone, {
    model,
  });

export default Stone;
