import Block from './Block';
import { SAND } from '../engine/Texture/textureConstants';

const Sand = () =>
  Block({
    id: 2,
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
