import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { woodenSlab } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { slab } from './Slab';

const model = new Cube({
  ...slab,
  textures: {
    top: PLANKS_OAK,
    bottom: PLANKS_OAK,
    north: PLANKS_OAK,
    south: PLANKS_OAK,
    west: PLANKS_OAK,
    east: PLANKS_OAK,
  },
});

const WoodenSlab = (): BlockData =>
  Block(woodenSlab, {
    isSlab: true,
    model,
  });

export default WoodenSlab;
