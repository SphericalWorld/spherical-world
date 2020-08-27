import { BlockInfo, baseBlock } from '../block';
import { OAK_LEAVES } from '../blocks';

export const oakLeaves: BlockInfo = {
  ...baseBlock,
  id: OAK_LEAVES,
  lightTransparent: false,
  sightTransparent: true,
  name: 'Oak Leaves',
};
