import Block from './Block';
import { OAK, OAK_TOP } from '../engine/Texture/textureConstants';

const Oak = () => Block({
  id: 4,
  textures: {
    top: OAK_TOP,
    bottom: OAK_TOP,
    north: OAK,
    south: OAK,
    west: OAK,
    east: OAK,
    affectBiomes: false,
  },
  baseRemoveTime: 3,
});

export default Oak;
