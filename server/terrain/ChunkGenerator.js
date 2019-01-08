// @flow strict
import type { Simplex2D, Simplex3D } from '../util/simplex';
import type Chunk from './Chunk';
import chain from '../../common/fp/algebraicDataTypes/Chain';
import { toByte } from '../../common/utils/numberUtils';
import { type IGenerator } from './chunk-generators/Generator.types';
import IO from '../../common/fp/monads/io';
import range from '../../common/range';
import { createSimplex2D, createSimplex3D } from '../util/simplex';

import ChunkMap from './ChunkMap';

import generateTree from './chunk-generators/Tree';
import generateTreasury from './chunk-generators/Treasury';

import { pipeMonadic } from '../../common/fp/pipe';

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
  TORCH,
  TALL_GRASS,
  FLOWER_YELLOW,
  FLOWER_RED,
  DEAD_BUSH,
  REEDS,
} from '../../common/blocks';

type ChunkLiftIO = ({
  chunk: Chunk, height: number, x: number, z: number,
}) => IO<Chunk>;

type GetBlock = (x: number, y: number, z: number, chunk: Chunk) => number;

const setBlocksInRangeIO = (getRange, getBlock: GetBlock): ChunkLiftIO => (params) => {
  const {
    chunk, height, x, z,
  } = params;
  const fn = y => chunk.setUnsafe(x, y, z, getBlock(x, y, z, chunk));
  return IO.from(() => range(...getRange(height), fn) || params);
};

const BIOME_SIZE = 256;
const WATER_LEVEL: 63 = 63;

export type ChunkGenerator = {|
  +seed: number;
  +structures: IGenerator[];
  +simplexHeightMapHills: Simplex2D;
  +simplexHeightMapMountains: Simplex2D;
  +simplexTemperature: Simplex2D;
  +simplexRainfall: Simplex2D;
  +simplexFoliage: Simplex2D;
  +simplexFoliageReeds: Simplex2D;
  +simplexCaves: Simplex3D;
  +simplexResourcesCoal: Simplex3D;
  +simplexResourcesIron: Simplex3D;
  +simplexResourcesClay: Simplex2D;
  +generateTree: $Call<typeof generateTree, *>,
|}

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
});

const generateHeightMap = (hills: Simplex2D, mountains: Simplex2D) => ({ x, z }) =>
  Math.max(
    Math.floor(62 + (hills(x, z) * 12)),
    Math.floor((62 + (((Math.abs(mountains(x, z)) ** 4)) * 60)) - 12),
  );

const generateRainfall = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + (simplex(x, z) * 128 * 2));

const generateTemperature = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + (simplex(x, z) * 128 * 2));

const getBiomeType = ({ temperature, rainfall }, x: number, z: number) => {
  if (rainfall.get(x, z) < 45 && temperature.get(x, z) > 150) return 'desert';
  return 'hills';
};

const generateCaves = (generator: ChunkGenerator) => setBlocksInRangeIO(
  height => [0, height],
  (x, y, z) => {
    if (generator.simplexCaves(x, y, z) > 0.6) return AIR;
    return STONE;
  },
);

const generateBiomeData = setBlocksInRangeIO(
  height => [height - 3, height],
  (x, y, z, chunk) => {
    if (!chunk.at(x, y, z)) return AIR;
    if (getBiomeType(chunk, x, z) === 'desert') return SAND;
    if (chunk.at(x, y + 1, z) === 0) return GRASS;
    return DIRT;
  },
);

const generateWater = setBlocksInRangeIO(height => [height + 1, WATER_LEVEL], () => WATER);

const generateResources = (generator: ChunkGenerator) => pipeMonadic(
  setBlocksInRangeIO(
    height => [height, height + 1],
    (x, y, z) => {
      if (y >= WATER_LEVEL) return AIR;
      if (y < WATER_LEVEL - 1 && generator.simplexResourcesClay(x, z) > 0.8) return CLAY;
      return SAND;
    },
  ),
  setBlocksInRangeIO(
    height => [0, height - 5],
    (x, y, z, chunk) => {
      if (!chunk.at(x, y, z)) return AIR;
      if (generator.simplexResourcesCoal(x, y, z) > 0.8) return COAL_ORE;
      if (generator.simplexResourcesIron(x, y, z) > 0.85) return IRON_ORE;
      return STONE;
    },
  ),
);

const generateReeds = ({
  chunk, x, z, height,
}) => IO.from(() => {
  if ((chunk.at(x, height, z - 1) === WATER)
  || (chunk.at(x, height, z + 1) === WATER)
  || (chunk.at(x - 1, height, z) === WATER)
  || (chunk.at(x + 1, height, z) === WATER)) {
    chunk.setUnsafe(x, height + 1, z, REEDS);
    chunk.setUnsafe(x, height + 2, z, REEDS);
    chunk.setUnsafe(x, height + 3, z, REEDS);
  }
});

const generateDesertBiome = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, height, x, z,
}) => chunk.setAt(x, height, z, (() => {
  if (generator.simplexFoliage(x, z) > 0.94) return DEAD_BUSH;
  return AIR;
})());

const generateHillsBiome = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, height, x, z,
}) => IO.from(() => {
  const s = generator.simplexFoliage(x, z);
  chunk.setUnsafe(x, height, z, (() => {
    if (s < 0) return AIR;
    if (s < 0.9) return TALL_GRASS;
    if (s < 0.93) return FLOWER_YELLOW;
    if (s < 0.95) return FLOWER_RED;
    if (s < 0.99) return TORCH;
    return AIR;
  })());
  if (s > 0.99) generator.generateTree(chunk, x, height, z).run();
  return chunk;
});

const generateBiomes = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, height, x, z,
  } = params;
  if ((height >= WATER_LEVEL) && chunk.at(x, height - 1, z)) {
    const biomeType = getBiomeType(chunk, x, z);
    (() => {
      if (biomeType === 'desert') return generateDesertBiome(generator)(params);
      return generateHillsBiome(generator)(params);
    })().run();
  } else if ((height === 62) && chunk.at(x, height, z)) {
    const s = generator.simplexFoliageReeds(x, z);
    if (s > 0.50) {
      generateReeds(params).run();
    }
  }
  return chunk;
});

const iterateChunk = funcToIterate => (chunk: Chunk): IO<Chunk> => chunk.heightMap
  .map((height, x, z) => funcToIterate({
    chunk, height, x: chunk.x + x, z: chunk.z + z,
  }))
  .reduce((f, g) => chain(() => f)(g));

const generateStructures = (generator: ChunkGenerator) =>
  pipeMonadic(...generator.structures);

const setHeightMap = (heightMap: ChunkMap<number>) => (chunk: Chunk) => IO.from(() => {
  chunk.heightMap = heightMap;
  return chunk;
});

const setRainfall = (rainfall: ChunkMap<number>) => (chunk: Chunk) => IO.from(() => {
  chunk.rainfall = rainfall;
  return chunk;
});

const setTemperature = (temperature: ChunkMap<number>) => (chunk: Chunk) => IO.from(() => {
  chunk.temperature = temperature;
  return chunk;
});

export const generate = (generator: ChunkGenerator, chunk: Chunk): IO<Chunk> => {
  const { x, z } = chunk;
  const data = ChunkMap
    .of(0)
    .map((_, i, j) => ({ x: x + i, z: z + j }));
  const heightMap = data.map(generateHeightMap(
    generator.simplexHeightMapHills,
    generator.simplexHeightMapMountains,
  ));
  const rainfall = data.map(generateRainfall(generator.simplexRainfall));
  const temperature = data.map(generateTemperature(generator.simplexTemperature));
  return pipeMonadic(
    setHeightMap(heightMap),
    setRainfall(rainfall),
    setTemperature(temperature),
    iterateChunk(pipeMonadic(
      generateCaves(generator),
      generateResources(generator),
      generateBiomeData,
      generateWater,
    )),
  )(chunk);
};

export const generateObjects = (generator: ChunkGenerator, chunk: Chunk): IO<Chunk> =>
  pipeMonadic(
    generateStructures(generator),
    iterateChunk(pipeMonadic(
      generateBiomes(generator),
    )),
  )(chunk);

export default createChunkGenerator;
