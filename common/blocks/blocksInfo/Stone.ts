import { BlockInfo, baseBlock } from '../block';
import { STONE } from '../blocks';

export const stone: BlockInfo = {
  ...baseBlock,
  id: STONE,
  name: 'Stone',
};
