import { BlockInfo, baseBlock } from '../block';
import { DIRT } from '../blocks';

export const dirt: BlockInfo = {
  ...baseBlock,
  id: DIRT,
  name: 'Dirt',
};
