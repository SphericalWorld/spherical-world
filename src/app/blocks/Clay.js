// @flow
import Block from './Block';
import { CLAY } from '../engine/textureConstants';

class Clay extends Block {
  id = 7;
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
    top: CLAY,
    bottom: CLAY,
    north: CLAY,
    south: CLAY,
    west: CLAY,
    east: CLAY,
  };
}

export default Clay;
