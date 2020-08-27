import type * as blocks from './blocks';

export type BlockFace = 0 | 1 | 2 | 3 | 4 | 5;

export type Block = ValueOf<typeof blocks>;

export type BlockInfo = {
  id: Block;
  fallSpeedCap: number;
  fallAcceleration: number;
  lightTransparent: boolean;
  sightTransparent: boolean;
  selfTransparent: boolean;
  needPhysics: boolean;
  baseRemoveTime: number;
  name: string;
};

export const baseBlock: BlockInfo = {
  id: 0,
  fallSpeedCap: Number.MIN_SAFE_INTEGER,
  fallAcceleration: 1,
  lightTransparent: false,
  sightTransparent: false,
  selfTransparent: false,
  needPhysics: true,
  baseRemoveTime: 1,
  name: 'Unnamed block',
};
