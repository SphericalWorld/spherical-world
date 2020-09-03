import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { planks } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: PLANKS_OAK },
    bottom: { texture: PLANKS_OAK },
    north: { texture: PLANKS_OAK },
    south: { texture: PLANKS_OAK },
    west: { texture: PLANKS_OAK },
    east: { texture: PLANKS_OAK },
  },
});

const Planks = (): BlockData =>
  Block(planks, {
    cube,
  });

export default Planks;
