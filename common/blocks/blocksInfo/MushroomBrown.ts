import { BlockInfo, baseBlock } from '../block';
import { MUSHROOM_BROWN } from '../blocks';

export const mushroomBrown: BlockInfo = {
  ...baseBlock,
  id: MUSHROOM_BROWN,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  baseRemoveTime: 0.2,
  name: 'Brown Mushroom',
};
