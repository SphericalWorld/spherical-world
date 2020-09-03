import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_STONE_BRICK } from '../engine/Texture/textureConstants';
import { stoneBrick } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: TEXTURE_STONE_BRICK },
    bottom: { texture: TEXTURE_STONE_BRICK },
    north: { texture: TEXTURE_STONE_BRICK },
    south: { texture: TEXTURE_STONE_BRICK },
    west: { texture: TEXTURE_STONE_BRICK },
    east: { texture: TEXTURE_STONE_BRICK },
  },
});

const StoneBrick = (): BlockData =>
  Block(stoneBrick, {
    cube,
  });

export default StoneBrick;
