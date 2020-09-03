import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_GRAVEL } from '../engine/Texture/textureConstants';
import { gravel } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: TEXTURE_GRAVEL,
    bottom: TEXTURE_GRAVEL,
    north: TEXTURE_GRAVEL,
    south: TEXTURE_GRAVEL,
    west: TEXTURE_GRAVEL,
    east: TEXTURE_GRAVEL,
  },
});

const Gravel = (): BlockData =>
  Block(gravel, {
    model,
  });

export default Gravel;
