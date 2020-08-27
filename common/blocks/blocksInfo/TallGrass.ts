import { BlockInfo, baseBlock } from '../block';
import { TALL_GRASS } from '../blocks';

export const tallGrass: BlockInfo = {
  ...baseBlock,
  id: TALL_GRASS,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  baseRemoveTime: 0.2,
  name: 'Tall Grass',
};
