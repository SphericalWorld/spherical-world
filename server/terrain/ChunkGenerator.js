// @flow
import type { Simplex2D, Simplex3D } from '../util/simplex';
import type Chunk from './Chunk';
import chain from '../../common/fp/algebraicDataTypes/Chain';
import { clamp } from '../../common/utils/numberUtils';
import { IGenerator } from './chunk-generators/Generator.types';
import IO from '../../common/fp/monads/io';
import range from '../../common/range';
import { createSimplex2D, createSimplex3D } from '../util/simplex';

import ChunkMap from './ChunkMap';

import generateTree from './chunk-generators/Tree';
import generateTreasury from './chunk-generators/Treasury';

import { getIndex } from '../../common/chunk';
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

const toUnary = fn => params => fn(params).chain(() => IO.of(params));
const rangeIO = (...params) => IO.from(() => range(...params));

const BIOME_SIZE = 256;
const WATER_LEVEL: 63 = 63;

declare class IChunkGenerator {
  static (): IChunkGenerator;
  +seed: number;
  +structures: IGenerator[];
  +simplexHeightMapHills: Simplex2D;
  +simplexHeightMapMountains: Simplex2D;
  +simplexTemperature: Simplex2D;
  +simplexRainfall: Simplex2D;
  +simplexFoliage: Simplex2D;
  +simplexCaves: Simplex3D;
  +simplexResourcesCoal: Simplex3D;
  +simplexResourcesIron: Simplex3D;
  +simplexResourcesClay: Simplex2D;
}

const ChunkGenerator = ((seed: number) => ({
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
}): Class<IChunkGenerator>);

const generateHeightMap = (hills: Simplex2D, mountains: Simplex2D) => ({ x, z }) =>
  Math.max(
    Math.floor(62 + (hills(x, z) * 12)),
    Math.floor((62 + (((Math.abs(mountains(x, z)) ** 4)) * 60)) - 12),
  );

const clamp256 = clamp(0, 255);
const toByte = (x: number) => Math.floor(clamp256(x));

const generateRainfall = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + (simplex(x, z) * 128 * 2));

const generateTemperature = (simplex: Simplex2D) => ({ x, z }) =>
  toByte(128 + (simplex(x, z) * 128 * 2));

type ChunkLiftIO = ({
  chunk: Chunk, i: number, j: number, height: number, x: number, z: number,
}) => IO<Chunk>;

const generateCaves = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, i, j, height, x, z,
}) => rangeIO(0, height, (y) => {
  chunk.setUnsafe(i, y, j, do {
    if (generator.simplexCaves(x, y, z) > 0.6) AIR;
    else STONE;
  });
});

const generateBiomeData: ChunkLiftIO = ({
  chunk, i, j, height, chunk: { data, rainfall, temperature },
}) => rangeIO(height - 3, height, (y) => {
  const index = getIndex(i, y, j);
  chunk.setAtIndex(index, do {
    if (!data[index]) AIR;
    else if (rainfall.get(i, j) < 45 && temperature.get(i, j) > 150) SAND;
    else if (data[index + 256] === 0) GRASS;
    else DIRT;
  });
});

const generateWater: ChunkLiftIO = ({
  chunk, i, j, height,
}) => rangeIO(height + 1, WATER_LEVEL, y => chunk.setUnsafe(i, y, j, WATER));

const generateResources = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, i, j, height, chunk: { data }, x, z,
}) => IO.from(() => {
  range(0, height - 5, (y) => {
    const index = getIndex(i, y, j);
    chunk.setAtIndex(index, do {
      if (!data[index]) AIR;
      else if (generator.simplexResourcesCoal(x, y, z) > 0.8) COAL_ORE;
      else if (generator.simplexResourcesIron(x, y, z) > 0.85) IRON_ORE;
      else STONE;
    });
  });
  if (height < WATER_LEVEL) {
    chunk.setUnsafe(i, height, j, do {
      if (height < 62 && generator.simplexResourcesClay(x, z) > 0.8) CLAY;
      else SAND;
    });
  }
});

const generateReeds = ({
  chunk, i, j, height,
}) => IO.from(() => {
  if ((chunk.at(i, height, j - 1) === WATER)
  || (chunk.at(i, height, j + 1) === WATER)
  || (chunk.at(i - 1, height, j) === WATER)
  || (chunk.at(i + 1, height, j) === WATER)) {
    chunk.setUnsafe(i, height + 1, j, REEDS);
    chunk.setUnsafe(i, height + 2, j, REEDS);
    chunk.setUnsafe(i, height + 3, j, REEDS);
  }
});

const getBiomeType = ({ temperature, rainfall }, x: number, z: number) => do {
  if (rainfall.get(x, z) < 45 && temperature.get(x, z) > 150) 'desert';
  else 'hills';
};

const generateDesertBiome = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, i, j, height, x, z,
}) => chunk.setAt(i, height, j, do {
  if (generator.simplexFoliage(x, z) > 0.94) DEAD_BUSH;
  else AIR;
});

const generateHillsBiome = (generator: ChunkGenerator): ChunkLiftIO => ({
  chunk, i, j, height, x, z,
}) => IO.from(() => {
  const s = generator.simplexFoliage(x, z);
  chunk.setUnsafe(i, height, j, do {
    if (s < 0) AIR;
    else if (s < 0.9) TALL_GRASS;
    else if (s < 0.93) FLOWER_YELLOW;
    else if (s < 0.95) FLOWER_RED;
    else if (s < 0.99) TORCH;
    else AIR;
  });
  if (s > 0.99) generator.generateTree(chunk, i, height, j).run();
});

const generateBiomes = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, x, z,
  } = params;
  if ((height >= WATER_LEVEL) && chunk.at(i, height - 1, j)) {
    const biomeType = getBiomeType(chunk, i, j);
    (do {
      if (biomeType === 'desert') generateDesertBiome(generator)(params);
      else generateHillsBiome(generator)(params);
    }).run();
  } else if ((height === 62) && chunk.at(i, height, j)) {
    const s = generator.simplexFoliageReeds(x, z);
    if (s > 0.50) {
      generateReeds(params).run();
    }
  }
  return params;
});

const iterateChunk = funcToIterate => (chunk: Chunk): IO<Chunk> => chunk.heightMap
  .map((height, i, j) => funcToIterate({
    chunk, i, j, height, x: chunk.x + i, z: chunk.z + j,
  }))
  .reduce((f, g) => chain(() => f)(g));

const generateStructures = (generator: ChunkGenerator) =>
  pipeMonadic(...generator.structures);

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
    chunk.setHeightMap(heightMap),
    chunk.setRainfall(rainfall),
    chunk.setTemperature(temperature),
    iterateChunk(pipeMonadic(...[
      generateCaves(generator),
      generateBiomeData,
      generateWater,
      generateResources(generator),
    ].map(toUnary))),
  )(chunk);
};

export const generateObjects = (generator: ChunkGenerator, chunk: Chunk): IO<Chunk> =>
  pipeMonadic(
    generateStructures(generator),
    iterateChunk(pipeMonadic(generateBiomes(generator))),
  )(chunk);

export default ChunkGenerator;
