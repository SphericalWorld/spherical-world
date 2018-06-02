// @flow
import Block from './Block';
import { STONE } from '../engine/textureConstants';

class Stone extends Block {
  id = 3;
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
    top: STONE,
    bottom: STONE,
    north: STONE,
    south: STONE,
    west: STONE,
    east: STONE,
  };
}

export default Stone;
