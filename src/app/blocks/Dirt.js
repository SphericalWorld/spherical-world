// @flow
import Block from './Block';
import { DIRT } from '../engine/Texture/textureConstants';

const Dirt = () => Block({
  id: 6,
  buffer: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },

  textures: {
    top: DIRT,
    bottom: DIRT,
    north: DIRT,
    south: DIRT,
    west: DIRT,
    east: DIRT,
  },
});

export default Dirt;
