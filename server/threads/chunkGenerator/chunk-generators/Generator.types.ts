import type Chunk from '../../../terrain/Chunk';

export type IGenerator = (chunk: Chunk) => Chunk;
