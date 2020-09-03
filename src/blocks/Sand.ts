import type { BlockData } from './Block';
import Block from './Block';
import { SAND } from '../engine/Texture/textureConstants';
import { sand } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: SAND },
    bottom: { texture: SAND },
    north: { texture: SAND },
    south: { texture: SAND },
    west: { texture: SAND },
    east: { texture: SAND },
  },
});

const Sand = (): BlockData =>
  Block(sand, {
    cube,
  });

export default Sand;
