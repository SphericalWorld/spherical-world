import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { PLANKS } from '../../common/blocks';

const Planks = (): BlockData =>
  Block({
    id: PLANKS,
    textures: {
      top: PLANKS_OAK,
      bottom: PLANKS_OAK,
      north: PLANKS_OAK,
      south: PLANKS_OAK,
      west: PLANKS_OAK,
      east: PLANKS_OAK,
    },
  });

export default Planks;
