import type { BlockData } from './Block';
import Block from './Block';
import { OAK, OAK_TOP } from '../engine/Texture/textureConstants';
import { oak } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: OAK_TOP,
    bottom: OAK_TOP,
    north: OAK,
    south: OAK,
    west: OAK,
    east: OAK,
  },
});

const Oak = (): BlockData =>
  Block(oak, {
    model,
    getRotation: (flags: number) => flags,
  });

export default Oak;
