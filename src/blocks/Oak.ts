import type { BlockData } from './Block';
import Block from './Block';
import { OAK, OAK_TOP } from '../engine/Texture/textureConstants';
import { oak } from '../../common/blocks/blocksInfo';

const Oak = (): BlockData =>
  Block(oak, {
    textures: {
      top: OAK_TOP,
      bottom: OAK_TOP,
      north: OAK,
      south: OAK,
      west: OAK,
      east: OAK,
      affectBiomes: false,
    },
    getRotation: (flags: number) => flags,
  });

export default Oak;
