import Block from './Block';
import { OAK_LEAVES } from '../engine/Texture/textureConstants';

const OakLeaves = () => Block({
  id: 5,
  lightTransparent: false,
  sightTransparent: true,
  buffer: {
    top: 1,
    bottom: 1,
    north: 1,
    south: 1,
    west: 1,
    east: 1,
  },

  textures: {
    top: OAK_LEAVES,
    bottom: OAK_LEAVES,
    north: OAK_LEAVES,
    south: OAK_LEAVES,
    west: OAK_LEAVES,
    east: OAK_LEAVES,
    affectBiomes: 'foliage',
  },
});

export default OakLeaves;
