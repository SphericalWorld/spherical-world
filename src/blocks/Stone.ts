import type { BlockData } from './Block';
import Block from './Block';
import { STONE } from '../engine/Texture/textureConstants';
import { stone } from '../../common/blocks/blocksInfo';

const Stone = (): BlockData =>
  Block(stone, {
    textures: {
      top: STONE,
      bottom: STONE,
      north: STONE,
      south: STONE,
      west: STONE,
      east: STONE,
    },
  });

export default Stone;
