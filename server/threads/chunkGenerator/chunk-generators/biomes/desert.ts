import type { Biome } from '../biome';
import type { ChunkGenerator, BlockPositionData } from '../../types';
import { DEAD_BUSH, AIR } from '../../../../../common/blocks';

const generateWithSurroundingChunks = (
  generator: ChunkGenerator,
  { chunk, height, x, z }: BlockPositionData,
): void =>
  chunk.generateAt(x, height, z, () => {
    if (generator.simplexFoliage(x, z) > 0.94) return DEAD_BUSH;
    return AIR;
  });

export const desert: Biome = {
  generateWithSurroundingChunks,
};
