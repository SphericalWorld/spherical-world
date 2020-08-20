import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_GRAVEL } from '../engine/Texture/textureConstants';
import { GRAVEL } from '../../common/blocks';

const Gravel = (): BlockData =>
  Block({
    id: GRAVEL,
    textures: {
      top: TEXTURE_GRAVEL,
      bottom: TEXTURE_GRAVEL,
      north: TEXTURE_GRAVEL,
      south: TEXTURE_GRAVEL,
      west: TEXTURE_GRAVEL,
      east: TEXTURE_GRAVEL,
    },
  });

export default Gravel;
