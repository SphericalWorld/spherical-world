// @flow
import type { Block } from './block';
import type { Maybe } from './fp/monads/maybe';

import { toChunkPosition, toPositionInChunk } from './chunk';

export const getBlock = (terrain) => (x: number, y: number, z: number): Maybe<Block> => terrain
  .getChunk(toChunkPosition(x), toChunkPosition(z))
  .map(chunk =>
    chunk.getBlock(toPositionInChunk(x), Math.floor(y), toPositionInChunk(z)));
