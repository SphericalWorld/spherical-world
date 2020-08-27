import { BlockInfo, baseBlock } from '../block';
import { GRAVEL } from '../blocks';

export const gravel: BlockInfo = {
  ...baseBlock,
  id: GRAVEL,
  name: 'Gravel',
};
