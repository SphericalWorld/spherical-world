import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_STONE_BRICK } from '../engine/Texture/textureConstants';
import { stoneBrick } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: TEXTURE_STONE_BRICK,
    bottom: TEXTURE_STONE_BRICK,
    north: TEXTURE_STONE_BRICK,
    south: TEXTURE_STONE_BRICK,
    west: TEXTURE_STONE_BRICK,
    east: TEXTURE_STONE_BRICK,
  },
});

const StoneBrick = (): BlockData =>
  Block(stoneBrick, {
    model,
  });

export default StoneBrick;
