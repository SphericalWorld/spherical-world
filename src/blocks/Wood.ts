import type { BlockData } from './Block';
import Block from './Block';
import { OAK } from '../engine/Texture/textureConstants';
import { WOOD } from '../../common/blocks';

const Wood = (): BlockData =>
  Block({
    id: WOOD,
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },

    textures: {
      top: OAK,
      bottom: OAK,
      north: OAK,
      south: OAK,
      west: OAK,
      east: OAK,
    },
  });

export default Wood;
