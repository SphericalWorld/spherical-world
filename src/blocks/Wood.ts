import type { BlockData } from './Block';
import Block from './Block';
import { OAK } from '../engine/Texture/textureConstants';
import { wood } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: OAK,
    bottom: OAK,
    north: OAK,
    south: OAK,
    west: OAK,
    east: OAK,
  },
});

const Wood = (): BlockData =>
  Block(wood, {
    model,
  });

export default Wood;
