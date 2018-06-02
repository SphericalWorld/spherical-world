// @flow
import Block from './Block';

class Air extends Block {
  id = 0;
  lightTransparent = true;
  sightTransparent = true;
  selfTransparent = true;
  needPhysics = false;
  buffer = {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  };
}

export default Air;
