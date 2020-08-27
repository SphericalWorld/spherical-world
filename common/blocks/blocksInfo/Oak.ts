import { BlockInfo, baseBlock } from '../block';
import { OAK } from '../blocks';

export const oak: BlockInfo = {
  ...baseBlock,
  id: OAK,
  baseRemoveTime: 3,
  name: 'Oak',
};
