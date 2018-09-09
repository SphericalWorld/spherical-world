// @flow
import Block from './Block';
import { COAL_ORE } from '../engine/Texture/textureConstants';

const CoalOre = () => Block({
  id: 8,
  buffer: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },

  textures: {
    top: COAL_ORE,
    bottom: COAL_ORE,
    north: COAL_ORE,
    south: COAL_ORE,
    west: COAL_ORE,
    east: COAL_ORE,
  },
});

export default CoalOre;
