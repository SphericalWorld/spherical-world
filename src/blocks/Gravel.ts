import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_GRAVEL } from '../engine/Texture/textureConstants';
import { gravel } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: TEXTURE_GRAVEL },
    bottom: { texture: TEXTURE_GRAVEL },
    north: { texture: TEXTURE_GRAVEL },
    south: { texture: TEXTURE_GRAVEL },
    west: { texture: TEXTURE_GRAVEL },
    east: { texture: TEXTURE_GRAVEL },
  },
});

const Gravel = (): BlockData =>
  Block(gravel, {
    cube,
  });

export default Gravel;
