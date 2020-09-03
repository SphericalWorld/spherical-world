import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { planks } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: PLANKS_OAK,
    bottom: PLANKS_OAK,
    north: PLANKS_OAK,
    south: PLANKS_OAK,
    west: PLANKS_OAK,
    east: PLANKS_OAK,
  },
});

const Planks = (): BlockData =>
  Block(planks, {
    model,
  });

export default Planks;
