import type { BlockData } from './Block';
import Block from './Block';
import { WATER_STILL } from '../engine/Texture/textureConstants';

const Water = (): BlockData =>
  Block({
    id: 127,
    sightTransparent: true,
    selfTransparent: true,
    needPhysics: false,
    fallSpeedCap: -3,
    fallAcceleration: 0.5,
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
