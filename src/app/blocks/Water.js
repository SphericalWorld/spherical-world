// @flow
import Block from './Block';
import { GRASS } from '../engine/textureConstants';

const Water = () => Block({
  id: 127,
  lightTransparent: false,
  sightTransparent: true,
  selfTransparent: true,
  needPhysics: false,
  fallSpeedCap: 0.002,
  fallAcceleration: 0.00001,
  buffer: {
    top: 2,
    bottom: 2,
    north: 2,
    south: 2,
    west: 2,
    east: 2,
  },

  textures: {
    top: GRASS,
    bottom: GRASS,
    north: GRASS,
    south: GRASS,
    west: GRASS,
    east: GRASS,
  },
});

export default Water;
