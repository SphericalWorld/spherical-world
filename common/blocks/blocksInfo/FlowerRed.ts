import { BlockInfo, baseBlock } from '../block';
import { FLOWER_RED } from '../blocks';

export const flowerRed: BlockInfo = {
  ...baseBlock,
  id: FLOWER_RED,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  baseRemoveTime: 0.2,
  name: 'Red Flower',
};
