import type { BlockData } from './Block';
import Block from './Block';
import { WATER_STILL } from '../engine/Texture/textureConstants';
import { water } from '../../common/blocks/blocksInfo';

const Water = (): BlockData =>
  Block(water, {
    buffer: {
      top: 2,
      bottom: 2,
      north: 2,
      south: 2,
      west: 2,
      east: 2,
    },

    textures: {
      top: WATER_STILL,
      bottom: WATER_STILL,
      north: WATER_STILL,
      south: WATER_STILL,
      west: WATER_STILL,
      east: WATER_STILL,
    },
  });

export default Water;
