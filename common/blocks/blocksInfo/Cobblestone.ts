import { BlockInfo, baseBlock } from '../block';
import { COBBLESTONE } from '../blocks';

export const cobblestone: BlockInfo = {
  ...baseBlock,
  id: COBBLESTONE,
  name: 'Cobblestone',
};
