import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_COBBLESTONE_MOSSY } from '../engine/Texture/textureConstants';
import { cobblestoneMossy } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: TEXTURE_COBBLESTONE_MOSSY },
    bottom: { texture: TEXTURE_COBBLESTONE_MOSSY },
    north: { texture: TEXTURE_COBBLESTONE_MOSSY },
    south: { texture: TEXTURE_COBBLESTONE_MOSSY },
    west: { texture: TEXTURE_COBBLESTONE_MOSSY },
    east: { texture: TEXTURE_COBBLESTONE_MOSSY },
  },
});

const CobblestoneMossy = (): BlockData =>
  Block(cobblestoneMossy, {
    cube,
  });

export default CobblestoneMossy;
