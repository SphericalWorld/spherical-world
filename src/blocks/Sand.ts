import type { BlockData } from './Block';
import Block from './Block';
import { SAND } from '../engine/Texture/textureConstants';
import { sand } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: SAND,
    bottom: SAND,
    north: SAND,
    south: SAND,
    west: SAND,
    east: SAND,
  },
});

const Sand = (): BlockData =>
  Block(sand, {
    model,
  });

export default Sand;
