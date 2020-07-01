import type Chunk from '../Chunk';

export type IGenerator = (chunk: Chunk) => Chunk;
