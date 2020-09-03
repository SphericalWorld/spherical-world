import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { woodenSlab } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 0.5, 1],
  faces: {
    top: { texture: PLANKS_OAK },
    bottom: { texture: PLANKS_OAK },
    north: { texture: PLANKS_OAK, uv: [0, 0, 1, 0.5] },
    south: { texture: PLANKS_OAK, uv: [0, 0, 1, 0.5] },
    west: { texture: PLANKS_OAK },
    east: { texture: PLANKS_OAK },
  },
});

const WoodenSlab = (): BlockData =>
  Block(woodenSlab, {
    textures: {
      top: PLANKS_OAK,
      bottom: PLANKS_OAK,
      north: PLANKS_OAK,
      south: PLANKS_OAK,
      west: PLANKS_OAK,
      east: PLANKS_OAK,
    },
    isSlab: true,
    cube,
  });

export default WoodenSlab;
