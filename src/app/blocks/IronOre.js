// @flow
import Block from './Block';
import { IRON_ORE } from '../engine/Texture/textureConstants';

const IronOre = () => Block({
  id: 9,
  lightTransparent: false,
  sightTransparent: false,
  selfTransparent: false,
  needPhysics: true,
  buffer: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },

  textures: {
    top: IRON_ORE,
    bottom: IRON_ORE,
    north: IRON_ORE,
    south: IRON_ORE,
    west: IRON_ORE,
    east: IRON_ORE,
  },
});

export default IronOre;
