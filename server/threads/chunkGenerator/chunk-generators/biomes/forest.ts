import { Biome } from '../biome';
import { ChunkGenerator, BlockPositionData } from '../../types';
import { AIR, TALL_GRASS, FLOWER_YELLOW, FLOWER_RED, TORCH } from '../../../../../common/blocks';
import type { Chunk } from '../../Chunk';

const generateWithSurroundingChunks = (
  generator: ChunkGenerator,
  { chunk, height, x, z }: BlockPositionData,
) => {
  const s = generator.simplexFoliage(x, z);
  chunk.generateAtIfEmpty(x, height, z, () => {
    if (s < 0) return AIR;
    if (s < 0.9) return TALL_GRASS;
    if (s < 0.93) return FLOWER_YELLOW;
    if (s < 0.95) return FLOWER_RED;
    if (s < 0.99) return TORCH;
    return AIR;
  });
  const s2 = generator.simplexFoliage(x * 32, z * 32);

  if (s2 > 0.9) return generator.generateTree(chunk, x, height, z);
  if (s > 0.98) return generator.generateStomp(chunk, x, height, z);

  return chunk;
};

const afterChunkGenerated = (generator: ChunkGenerator, chunk: Chunk): void => {
  generator.houses.smallForestHouse1(chunk);
};

export const forest: Biome = {
  generateWithSurroundingChunks,
  afterChunkGenerated,
};
