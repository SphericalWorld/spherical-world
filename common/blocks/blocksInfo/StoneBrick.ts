import { BlockInfo, baseBlock } from '../block';
import { STONE_BRICK } from '../blocks';

export const stoneBrick: BlockInfo = {
  ...baseBlock,
  id: STONE_BRICK,
  name: 'Stone Brick',
};
