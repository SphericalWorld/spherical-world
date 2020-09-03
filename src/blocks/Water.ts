import type { BlockData } from './Block';
import Block from './Block';
import { WATER_STILL } from '../engine/Texture/textureConstants';
import { water } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: WATER_STILL,
    bottom: WATER_STILL,
    north: WATER_STILL,
    south: WATER_STILL,
    west: WATER_STILL,
    east: WATER_STILL,
  },
});

const Water = (): BlockData =>
  Block(water, {
    buffer: {
      top: 2,
      bottom: 2,
      north: 2,
      south: 2,
      west: 2,
      east: 2,
    },
    model,
  });

export default Water;
