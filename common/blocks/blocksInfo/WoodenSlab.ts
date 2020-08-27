import { BlockInfo, baseBlock } from '../block';
import { WOODEN_SLAB } from '../blocks';

export const woodenSlab: BlockInfo = {
  ...baseBlock,
  id: WOODEN_SLAB,
  sightTransparent: true,
  name: 'Wooden Slab',
};
