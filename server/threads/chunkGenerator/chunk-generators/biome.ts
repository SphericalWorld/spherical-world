import { BlockPositionData, ChunkGenerator } from '../types';

export type Biome = Readonly<{
  generateWithSurroundingChunks: (
    generator: ChunkGenerator,
    chunkData: BlockPositionData,
  ) => unknown;
}>;
