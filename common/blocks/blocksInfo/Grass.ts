import { BlockInfo, baseBlock } from '../block';
import { GRASS } from '../blocks';

export const grass: BlockInfo = {
  ...baseBlock,
  id: GRASS,
  name: 'Grass',
};
