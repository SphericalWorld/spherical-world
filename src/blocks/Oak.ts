import type { BlockData } from './Block';
import Block from './Block';
import { OAK, OAK_TOP } from '../engine/Texture/textureConstants';
import { oak } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: OAK_TOP },
    bottom: { texture: OAK_TOP },
    north: { texture: OAK },
    south: { texture: OAK },
    west: { texture: OAK },
    east: { texture: OAK },
  },
});

const Oak = (): BlockData =>
  Block(oak, {
    cube,
    getRotation: (flags: number) => flags,
  });

export default Oak;
