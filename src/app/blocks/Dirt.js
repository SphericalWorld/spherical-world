// @flow
import Block from './Block';
import { DIRT } from '../engine/Texture/textureConstants';

const Dirt = () => Block({
  id: 6,
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
