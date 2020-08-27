import { BlockInfo, baseBlock } from '../block';
import { AIR } from '../blocks';

export const air: BlockInfo = {
  ...baseBlock,
  id: AIR,
  lightTransparent: true,
  sightTransparent: true,
  selfTransparent: true,
  needPhysics: false,
  name: 'Air',
};
