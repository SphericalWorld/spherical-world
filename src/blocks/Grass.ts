import Block from './Block';
import { GRASS, GRASS_SIDE, DIRT } from '../engine/Texture/textureConstants';

const Grass = () =>
  Block({
    id: 1,
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },

    textures: {
      top: GRASS,
      bottom: DIRT,
      north: GRASS_SIDE,
      south: GRASS_SIDE,
      west: GRASS_SIDE,
      east: GRASS_SIDE,
    },
  });

export default Grass;
