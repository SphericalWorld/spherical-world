import { BlockInfo, baseBlock } from '../block';
import { WATER } from '../blocks';

export const water: BlockInfo = {
  ...baseBlock,
  id: WATER,
  sightTransparent: true,
  selfTransparent: true,
  needPhysics: false,
  fallSpeedCap: -3,
  fallAcceleration: 0.5,
  name: 'Water',
};
