import type { Simplex2D } from '../../util/simplex';
import type { Chunk } from './Chunk';
import { toByte } from '../../../common/utils/numberUtils';
import range from '../../../common/range';
import { createSimplex2D, createSimplex3D } from '../../util/simplex';
import ChunkMap from '../../terrain/ChunkMap';
import generateTree from './chunk-generators/Tree';
import generateTreasury from './chunk-generators/Treasury';

import {
  AIR,
  GRASS,
  SAND,
  STONE,
  DIRT,
  CLAY,
  COAL_ORE,
  IRON_ORE,
  WATER,
  REEDS,
  PODZOL,
} from '../../../common/blocks';
import { ChunkGenerator, BiomeType } from './types';
import { biomes } from './chunk-generators/biomes';

type BlockPositionData = Readonly<{ chunk: Chunk; height: number; x: number; z: number }>;
type ChunkGeneratorFn = (block: BlockPositionData) => void;

type GetBlock = (x: number, y: number, z: number, chunk: Chunk) => number;

const setBlocksInRange = (
  getRange: (currentHeight: number) => [number, number],
  getBlock: GetBlock,
): ChunkGeneratorFn => (params) => {
  const { chunk, height, x, z } = params;
  const fn = (y: number) => chunk.setAtSameChunkOnly(x, y, z, getBlock(x, y, z, chunk));
  range(...getRange(height), fn);
  return params;
};

const BIOME_SIZE = 256;
const WATER_LEVEL: 63 = 63;

const createChunkGenerator = (seed: number): ChunkGenerator => ({
  seed,
  simplexHeightMapHills: createSimplex2D(seed, 128),
  simplexHeightMapMountains: createSimplex2D(seed + 1, 256),
  simplexTemperature: createSimplex2D(seed + 2, BIOME_SIZE),
  simplexRainfall: createSimplex2D(seed + 3, BIOME_SIZE),
  simplexFoliage: createSimplex2D(seed + 4),
  simplexFoliageReeds: createSimplex2D(seed + 5, 64),
  simplexResourcesCoal: createSimplex3D(seed + 6, 8),
  simplexResourcesIron: createSimplex3D(seed + 7, 8),
  simplexResourcesClay: createSimplex2D(seed + 8, 8),
  simplexCaves: createSimplex3D(seed + 9, 16),
  generateTree: generateTree(seed + 10),
  structures: [generateTreasury(seed + 11)],
  simplexHeightMapRivers: createSimplex2D(seed + 12, 1024),
});

// const generateHeightMap = (hills: Simplex2D, mountains: Simplex2D) => ({ x, z }) =>
//   Math.max(
//     Math.floor(62 + hills(x, z) * 12),
//     Math.floor(62 + Math.abs(mountains(x, z)) ** 4 * 60 - 12),
//   );

function ridgenoise(noise, nx, ny) {
  return 2 * (0.5 - Math.abs(noise(nx, ny) / 2));
}

const RIVER_THRESHOLD = 0.91;

const generateHeightMap = (
  hills: Simplex2D,
  mountains: Simplex2D,
  simplexHeightMapRivers: Simplex2D,
) => ({ x, z }) => {
  const data =
    2 * (0.5 - Math.abs(simplexHeightMapRivers(x, z) + simplexHeightMapRivers(x * 4, z * 4) / 4));
  const res = data >= 0 ? Math.sqrt(data) : 0;
  if (res > RIVER_THRESHOLD) {
    return (
      62 -
      10 * (res - RIVER_THRESHOLD) * 10 +
      simplexHeightMapRivers(x * 64, z * 64) * 2 * ((res - RIVER_THRESHOLD) / (1 - RIVER_THRESHOLD))
      // simplexHeightMapRivers(x * 32, z * 32) * 1
    );
  }

  const clampedRes = 1 - (res / RIVER_THRESHOLD) ** 25;
  return Math.max(
    Math.floor(62 + ((1 + hills(x, z)) / 2) * 12 * clampedRes),
    Math.floor(62 + Math.abs(mountains(x, z)) ** 4 * 60 * clampedRes - 12),
    62,
  );
};

const generateRainfall = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + simplex(x, z) * 128 * 2);

const generateTemperature = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + simplex(x, z) * 128 * 2);

const getBiomeType = ({ temperature, rainfall }, x: number, z: number) => {
  if (rainfall.get(x, z) < 45 && temperature.get(x, z) > 150) return BiomeType.desert;
  if (rainfall.get(x, z) > 100 && rainfall.get(x, z) < 200 && temperature.get(x, z) < 150)
    return BiomeType.forest;

  return BiomeType.hills;
};

const generateCaves = (generator: ChunkGenerator) =>
  setBlocksInRange(
    (height) => [0, height],
    (x, y, z) => {
      if (generator.simplexCaves(x, y, z) > 0.6) return AIR;
      return STONE;
    },
  );

const generateBiomeData = setBlocksInRange(
  (height) => [height - 3, height],
  (x, y, z, chunk) => {
    if (!chunk.at(x, y, z)) return AIR;
    const biome = getBiomeType(chunk, x, z);
    if (biome === BiomeType.desert) return SAND;
    if (biome === BiomeType.forest) return chunk.at(x, y + 1, z) === 0 ? PODZOL : DIRT;

    if (chunk.at(x, y + 1, z) === 0) return GRASS;
    return DIRT;
  },
);

const generateWater = setBlocksInRange(
  (height) => [height + 1, WATER_LEVEL],
  () => WATER,
);

const generateResources = (generator: ChunkGenerator): ChunkGeneratorFn => (params) => {
  setBlocksInRange(
    (height) => [height, height + 1],
    (x, y, z) => {
      if (y >= WATER_LEVEL) return AIR;
      if (y < WATER_LEVEL - 1 && generator.simplexResourcesClay(x, z) > 0.8) return CLAY;
      return SAND;
    },
  )(params);
  setBlocksInRange(
    (height) => [0, height - 5],
    (x, y, z, chunk) => {
      if (!chunk.at(x, y, z)) return AIR;
      if (generator.simplexResourcesCoal(x, y, z) > 0.8) return COAL_ORE;
      if (generator.simplexResourcesIron(x, y, z) > 0.85) return IRON_ORE;
      return STONE;
    },
  )(params);
};

const generateReeds = ({ chunk, x, z, height }: BlockPositionData) => {
  if (
    chunk.at(x, height, z - 1) === WATER ||
    chunk.at(x, height, z + 1) === WATER ||
    chunk.at(x - 1, height, z) === WATER ||
    chunk.at(x + 1, height, z) === WATER
  ) {
    chunk.setAt(x, height + 1, z, REEDS);
    chunk.setAt(x, height + 2, z, REEDS);
    chunk.setAt(x, height + 3, z, REEDS);
  }
};

const generateBiomes = (generator: ChunkGenerator): ChunkGeneratorFn => (params) => {
  const { chunk, height, x, z } = params;
  if (height >= WATER_LEVEL && chunk.at(x, height - 1, z)) {
    const biomeType = getBiomeType(chunk, x, z);
    switch (biomeType) {
      case BiomeType.desert: {
        biomes.desert.generateWithSurroundingChunks(generator, params);
        break;
      }
      case BiomeType.forest: {
        biomes.forest.generateWithSurroundingChunks(generator, params);
        break;
      }
      case BiomeType.hills: {
        biomes.hills.generateWithSurroundingChunks(generator, params);
        break;
      }
      default: {
        ((_: never) => _)(biomeType);
      }
    }
  } else if (height === 62 && chunk.at(x, height, z)) {
    const s = generator.simplexFoliageReeds(x, z);
    if (s > 0.5) {
      generateReeds(params);
    }
  }
};

const iterateChunk = (funcToIterate: (params: BlockPositionData) => unknown) => (
  chunk: Chunk,
): Chunk => {
  chunk.heightMap.map((height, x, z) =>
    funcToIterate({
      chunk,
      height,
      x: chunk.x + x,
      z: chunk.z + z,
    }),
  );
  return chunk;
};

const generateStructures = (generator: ChunkGenerator, chunk: Chunk) =>
  generator.structures.forEach((generate) => generate(chunk));

const setHeightMap = (chunk: Chunk, heightMap: ChunkMap<number>) => {
  chunk.setHeightMap(heightMap);
};

const setRainfall = (chunk: Chunk, rainfall: ChunkMap<number>) => {
  chunk.setRainfall(rainfall);
};

const setTemperature = (chunk: Chunk, temperature: ChunkMap<number>) => {
  chunk.setTemperature(temperature);
};

export const generate = (generator: ChunkGenerator, chunk: Chunk): void => {
  const { x, z } = chunk;
  const data = ChunkMap.of(0).map((_, i, j) => ({ x: x + i, z: z + j }));
  const heightMap = data.map(
    generateHeightMap(
      generator.simplexHeightMapHills,
      generator.simplexHeightMapMountains,
      generator.simplexHeightMapRivers,
    ),
  );
  const rainfall = data.map(generateRainfall(generator.simplexRainfall));
  const temperature = data.map(generateTemperature(generator.simplexTemperature));
  setHeightMap(chunk, heightMap);
  setRainfall(chunk, rainfall);
  setTemperature(chunk, temperature);
  iterateChunk((params) => {
    generateCaves(generator)(params);
    generateResources(generator)(params);
    generateBiomeData(params);
    generateWater(params);
  })(chunk);
};

export const generateObjects = (generator: ChunkGenerator, chunk: Chunk): void => {
  generateStructures(generator, chunk);
  iterateChunk((params) => {
    generateBiomes(generator)(params);
  })(chunk);
};

export default createChunkGenerator;
