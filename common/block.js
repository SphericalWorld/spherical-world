// @flow strict
import * as blocks from './blocks';

export type BlockFace = 0 | 1 | 2 | 3 | 4 | 5;

export type Block = $Values<typeof blocks>
