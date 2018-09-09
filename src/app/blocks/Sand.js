// @flow
import Block from './Block';
import { SAND } from '../engine/Texture/textureConstants';

const Sand = () => Block({
  id: 2,
  buffer: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },

  textures: {
    top: SAND,
    bottom: SAND,
    north: SAND,
    south: SAND,
    west: SAND,
    east: SAND,
  },
  baseRemoveTime: 1,
});

export default Sand;
