import type { BlockData } from './Block';
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';
import { cobblestone } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: COBBLESTONE },
    bottom: { texture: COBBLESTONE },
    north: { texture: COBBLESTONE },
    south: { texture: COBBLESTONE },
    west: { texture: COBBLESTONE },
    east: { texture: COBBLESTONE },
  },
});

const Cobblestone = (): BlockData =>
  Block(cobblestone, {
    cube,
  });

export default Cobblestone;
