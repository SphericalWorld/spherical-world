import type { BlockData } from './Block';
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';
import { cobblestone } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: COBBLESTONE,
    bottom: COBBLESTONE,
    north: COBBLESTONE,
    south: COBBLESTONE,
    west: COBBLESTONE,
    east: COBBLESTONE,
  },
});

const Cobblestone = (): BlockData =>
  Block(cobblestone, {
    model,
  });

export default Cobblestone;
