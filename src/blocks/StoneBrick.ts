import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_STONE_BRICK } from '../engine/Texture/textureConstants';
import { STONE_BRICK } from '../../common/blocks';

const StoneBrick = (): BlockData =>
  Block({
    id: STONE_BRICK,
    textures: {
      top: TEXTURE_STONE_BRICK,
      bottom: TEXTURE_STONE_BRICK,
      north: TEXTURE_STONE_BRICK,
      south: TEXTURE_STONE_BRICK,
      west: TEXTURE_STONE_BRICK,
      east: TEXTURE_STONE_BRICK,
    },
  });

export default StoneBrick;
