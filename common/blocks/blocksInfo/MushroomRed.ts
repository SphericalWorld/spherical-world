import { BlockInfo, baseBlock } from '../block';
import { MUSHROOM_RED } from '../blocks';

export const mushroomRed: BlockInfo = {
  ...baseBlock,
  id: MUSHROOM_RED,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  baseRemoveTime: 0.2,
  name: 'Red Mushroom',
};
