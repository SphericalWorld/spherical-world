import type { BlockData } from './Block';
import Block from './Block';
import { GRASS, GRASS_SIDE, DIRT } from '../engine/Texture/textureConstants';
import { grass } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: GRASS },
    bottom: { texture: DIRT },
    north: { texture: GRASS_SIDE },
    south: { texture: GRASS_SIDE },
    west: { texture: GRASS_SIDE },
    east: { texture: GRASS_SIDE },
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
    cube,
  });

export default Grass;
