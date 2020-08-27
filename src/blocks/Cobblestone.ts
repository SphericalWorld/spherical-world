import type { BlockData } from './Block';
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';
import { cobblestone } from '../../common/blocks/blocksInfo';

const Cobblestone = (): BlockData =>
  Block(cobblestone, {
    textures: {
      top: COBBLESTONE,
      bottom: COBBLESTONE,
      north: COBBLESTONE,
      south: COBBLESTONE,
      west: COBBLESTONE,
      east: COBBLESTONE,
    },
  });

export default Cobblestone;
