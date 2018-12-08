// @flow strict
import Block from './Block';
import { COBBLESTONE } from '../engine/Texture/textureConstants';

const Cobblestone = () => Block({
  id: 16,
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
