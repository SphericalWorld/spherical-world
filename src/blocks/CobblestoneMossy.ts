import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_COBBLESTONE_MOSSY } from '../engine/Texture/textureConstants';
import { cobblestoneMossy } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: TEXTURE_COBBLESTONE_MOSSY,
    bottom: TEXTURE_COBBLESTONE_MOSSY,
    north: TEXTURE_COBBLESTONE_MOSSY,
    south: TEXTURE_COBBLESTONE_MOSSY,
    west: TEXTURE_COBBLESTONE_MOSSY,
    east: TEXTURE_COBBLESTONE_MOSSY,
  },
});

const CobblestoneMossy = (): BlockData =>
  Block(cobblestoneMossy, {
    model,
  });

export default CobblestoneMossy;
