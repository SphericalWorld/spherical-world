import type { BlockData } from './Block';
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';

const Cobblestone = (): BlockData =>
  Block({
    id: 16,
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
