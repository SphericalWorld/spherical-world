import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_PODZOL, TEXTURE_PODZOL_SIDE, DIRT } from '../engine/Texture/textureConstants';
import { podzol } from '../../common/blocks/blocksInfo';

const Podzol = (): BlockData =>
  Block(podzol, {
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },

    textures: {
      top: TEXTURE_PODZOL,
      bottom: DIRT,
      north: TEXTURE_PODZOL_SIDE,
      south: TEXTURE_PODZOL_SIDE,
      west: TEXTURE_PODZOL_SIDE,
      east: TEXTURE_PODZOL_SIDE,
    },
  });

export default Podzol;
