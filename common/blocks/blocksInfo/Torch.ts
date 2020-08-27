import { BlockInfo, baseBlock } from '../block';
import { TORCH } from '../blocks';

export const torch: BlockInfo = {
  ...baseBlock,
  id: TORCH,
  lightTransparent: true,
  sightTransparent: true,
  selfTransparent: false,
  needPhysics: false,
  name: 'Torch',
};
