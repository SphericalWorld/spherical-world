import { BlockInfo, baseBlock } from '../block';
import { SAND } from '../blocks';

export const sand: BlockInfo = {
  ...baseBlock,
  id: SAND,
  name: 'Sand',
};
