import type { BlockPositionData, ChunkGenerator } from '../types';
import type { Chunk } from '../Chunk';

export type Biome = Readonly<{
  generateWithSurroundingChunks: (
    generator: ChunkGenerator,
    chunkData: BlockPositionData,
  ) => unknown;
  afterChunkGenerated?: (generator: ChunkGenerator, chunk: Chunk) => unknown;
}>;
