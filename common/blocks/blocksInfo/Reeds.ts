import { BlockInfo, baseBlock } from '../block';
import { REEDS } from '../blocks';

export const reeds: BlockInfo = {
  ...baseBlock,
  id: REEDS,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  name: 'Reeds',
};
