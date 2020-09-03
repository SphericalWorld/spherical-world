import type { BlockData } from './Block';
import Block from './Block';
import { CLAY } from '../engine/Texture/textureConstants';
import { clay } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: CLAY,
    bottom: CLAY,
    north: CLAY,
    south: CLAY,
    west: CLAY,
    east: CLAY,
  },
});

const Clay = (): BlockData =>
  Block(clay, {
    model,
  });

export default Clay;
