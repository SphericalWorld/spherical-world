// @flow
import Block from './Block';
import { DIRT } from '../engine/textureConstants';

class Dirt extends Block {
  id = 6;
  lightTransparent = false;
  sightTransparent = false;
  selfTransparent = false;
  needPhysics = true;
  buffer = {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  };
  textures = {
    top: DIRT,
    bottom: DIRT,
    north: DIRT,
    south: DIRT,
    west: DIRT,
    east: DIRT,
  };
}

export default Dirt;
