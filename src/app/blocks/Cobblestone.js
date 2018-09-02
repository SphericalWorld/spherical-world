// @flow
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';

const Cobblestone = () => Block({
  id: 16,
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
    top: COBBLESTONE,
    bottom: COBBLESTONE,
    north: COBBLESTONE,
    south: COBBLESTONE,
    west: COBBLESTONE,
    east: COBBLESTONE,
  },
});

export default Cobblestone;
