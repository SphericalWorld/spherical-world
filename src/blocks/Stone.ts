import Block from './Block';
import { STONE } from '../engine/Texture/textureConstants';

const Stone = () =>
  Block({
    id: 3,
    textures: {
      top: STONE,
      bottom: STONE,
      north: STONE,
      south: STONE,
      west: STONE,
      east: STONE,
    },
  });

export default Stone;
