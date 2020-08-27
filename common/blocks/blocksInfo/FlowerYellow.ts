import { BlockInfo, baseBlock } from '../block';
import { FLOWER_YELLOW } from '../blocks';

export const flowerYellow: BlockInfo = {
  ...baseBlock,
  id: FLOWER_YELLOW,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  baseRemoveTime: 0.2,
  name: 'Yellow Flower',
};
