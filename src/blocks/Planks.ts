import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { planks } from '../../common/blocks/blocksInfo';

const Planks = (): BlockData =>
  Block(planks, {
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
