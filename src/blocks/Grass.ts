import type { BlockData } from './Block';
import Block from './Block';
import { GRASS, GRASS_SIDE, DIRT } from '../engine/Texture/textureConstants';
import { grass } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: GRASS,
    bottom: DIRT,
    north: GRASS_SIDE,
    south: GRASS_SIDE,
    west: GRASS_SIDE,
    east: GRASS_SIDE,
  },
});

const Grass = (): BlockData =>
  Block(grass, {
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },
    model,
  });

export default Grass;
