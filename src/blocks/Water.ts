import type { BlockData } from './Block';
import Block from './Block';
import { WATER_STILL } from '../engine/Texture/textureConstants';
import { water } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: WATER_STILL },
    bottom: { texture: WATER_STILL },
    north: { texture: WATER_STILL },
    south: { texture: WATER_STILL },
    west: { texture: WATER_STILL },
    east: { texture: WATER_STILL },
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
    cube,
  });

export default Water;
