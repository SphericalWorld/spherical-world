import type { BlockData } from './Block';
import Block from './Block';
import { OAK } from '../engine/Texture/textureConstants';
import { wood } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: OAK },
    bottom: { texture: OAK },
    north: { texture: OAK },
    south: { texture: OAK },
    west: { texture: OAK },
    east: { texture: OAK },
  },
});

const Wood = (): BlockData =>
  Block(wood, {
    cube,
  });

export default Wood;
