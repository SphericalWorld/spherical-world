// @flow
import Block from './Block';
import { OAK, OAK_TOP } from '../engine/textureConstants';

class Oak extends Block {
  id = 4;
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
    top: OAK_TOP,
    bottom: OAK_TOP,
    north: OAK,
    south: OAK,
    west: OAK,
    east: OAK,
    affectBiomes: false,
  };
}

export default Oak;
