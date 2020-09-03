import type { BlockData } from './Block';
import Block from './Block';
import { DIRT } from '../engine/Texture/textureConstants';
import { dirt } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: DIRT,
    bottom: DIRT,
    north: DIRT,
    south: DIRT,
    west: DIRT,
    east: DIRT,
  },
});

const Dirt = (): BlockData =>
  Block(dirt, {
    model,
  });

export default Dirt;
