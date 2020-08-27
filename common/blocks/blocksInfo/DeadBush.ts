import { BlockInfo, baseBlock } from '../block';
import { DEAD_BUSH } from '../blocks';

export const deadBush: BlockInfo = {
  ...baseBlock,
  id: DEAD_BUSH,
  lightTransparent: true,
  sightTransparent: true,
  needPhysics: false,
  name: 'Dead Bush',
};
