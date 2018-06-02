// @flow
import type { Simplex2D, Simplex3D } from '../util/simplex';
import type Chunk from './Chunk';
import { IGenerator } from './chunk-generators/Generator.types';
import IO from '../../common/fp/monads/io';
import range from '../../common/range';
import { createSimplex2D, createSimplex3D } from '../util/simplex';

import ChunkMap from './ChunkMap';

import generateTree from './chunk-generators/Tree';
import generateTreasury from './chunk-generators/Treasury';

import { getIndex } from '../../common/chunk';
import { pipeMonadic } from '../../common/fp/pipe';

const BIOME_SIZE = 512;

declare class IChunkGenerator {
  static (): IChunkGenerator;
  +seed: number;
  +structures: IGenerator[];
  +simplexHeightMap: Simplex2D;
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
  simplexHeightMap: createSimplex2D(seed, 128),
  simplexTemperature: createSimplex2D(seed + 1, BIOME_SIZE),
  simplexRainfall: createSimplex2D(seed + 2, BIOME_SIZE),
  simplexFoliage: createSimplex2D(seed + 3),
  simplexFoliageReeds: createSimplex2D(seed + 3, 64),
  simplexResourcesCoal: createSimplex3D(seed + 4, 8),
  simplexResourcesIron: createSimplex3D(seed + 5, 8),
  simplexResourcesClay: createSimplex2D(seed + 6, 8),
  simplexCaves: createSimplex3D(seed + 7, 16),
  generateTree: generateTree(seed + 8),
  structures: [generateTreasury(seed + 9)],
}): Class<IChunkGenerator>);

const generateHeightMap = (simplex: Simplex2D, x: number, z: number) => (el, i, j) =>
  Math.floor(62 + (simplex(x + j, z + i) * 12));

const generateRainfall = (simplex: Simplex2D, x: number, z: number) => (el, i, j) =>
  Math.floor(128 + (simplex(x + j, z + i) * 128));

const generateTemperature = (simplex: Simplex2D, x: number, z: number) => (el, i, j) =>
  Math.floor(128 + (simplex(x + j, z + i) * 128));

type ChunkLiftIO = ({ chunk: Chunk, i: number, j: number, height: number }) => IO<Chunk>;

const generateCaves = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { x, z },
  } = params;
  range(0, height, (k) => {
    chunk.setAt(j, k, i, do {
      if (generator.simplexCaves(x + j, z + i, k) > 0.6) 0;
      else 3;
    });
  });
  return params;
});

const generateBiomeData: ChunkLiftIO = params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { data, temperature },
  } = params;
  range(height - 3, height, (k) => {
    const index = getIndex(j, k, i);
    chunk.setAtIndex(index, do {
      if (!data[index]) 0;
      else if (temperature.get(i, j) > 160) 2;
      else if (data[index + 256] === 0) 1;
      else 6;
    });
  });
  return params;
});

const generateWater: ChunkLiftIO = params => IO.from(() => {
  const {
    chunk, i, j, height,
  } = params;
  range(height + 1, 63, k => chunk.setAt(j, k, i, 127));
  return params;
});

const generateResources = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { data, x, z },
  } = params;
  range(0, height - 5, (k) => {
    const index = getIndex(j, k, i);
    chunk.setAtIndex(index, do {
      if (!data[index]) 0;
      else if (generator.simplexResourcesCoal(x + j, z + i, k) > 0.8) 8;
      else if (generator.simplexResourcesIron(x + j, z + i, k) > 0.85) 9;
      else 3;
    });
  });
  if (height < 63) {
    chunk.setAt(j, height, i, do {
      if (height < 62 && generator.simplexResourcesClay(x + j, z + i) > 0.8) 7;
      else 2;
    });
  }
  return params;
});

const generateReeds = params => IO.from(() => {
  const {
    chunk, i, j, height,
  } = params;
  if ((chunk.at(j, height, i - 1) === 127) ||
  (chunk.at(j, height, i + 1) === 127) ||
  (chunk.at(j - 1, height, i) === 127) ||
  (chunk.at(j + 1, height, i) === 127)) {
    chunk.setAt(j, height + 1, i, 133);
    chunk.setAt(j, height + 2, i, 133);
    chunk.setAt(j, height + 3, i, 133);
  }
  return params;
});

const getBiomeType = ({ temperature }, x: number, z: number) => do {
  if (temperature.get(x, z) > 160) 'desert';
  else if (temperature.get(x, z) <= 160) 'hills';
};

const generateDesertBiome = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { x, z },
  } = params;
  chunk.setAt(j, height, i, do {
    if (generator.simplexFoliage(x + j, z + i) > 0.94) 132;
    else 0;
  });
  return params;
});

const generateHillsBiome = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { x, z },
  } = params;
  const s = generator.simplexFoliage((x + j), (z + i));
  chunk.setAt(j, height, i, do {
    if (s < 0) 0;
    else if (s < 0.9) 129; // grass
    else if (s < 0.93) 130; // yellow flower
    else if (s < 0.99) 131;
    else 0;
  });
  if (s > 0.99) generator.generateTree(chunk, j, height, i).run();
  return params;
});

const generateBiomes = (generator: ChunkGenerator): ChunkLiftIO => params => IO.from(() => {
  const {
    chunk, i, j, height, chunk: { x, z },
  } = params;
  if ((height >= 63) && chunk.at(j, height - 1, i)) {
    const biomeType = getBiomeType(chunk, i, j);
    (do {
      if (biomeType === 'desert') generateDesertBiome(generator)(params);
      else generateHillsBiome(generator)(params);
    }).run();
  } else if ((height === 62) && chunk.at(j, height, i)) {
    const s = generator.simplexFoliageReeds(x + j, z + i);
    if (s > 0.50) {
      generateReeds(params).run();
    }
  }
  return params;
});

const iterateChunk = funcToIterate => (chunk: Chunk): IO<Chunk> => chunk.heightMap
  .map((height, i, j) => funcToIterate({
    chunk, i, j, height,
  }))
  .reduce((f, g) => g.chain(() => f));

const generateStructures = (generator: ChunkGenerator) =>
  pipeMonadic(...generator.structures);

export const generate = (generator: ChunkGenerator, chunk: Chunk): IO<Chunk> => {
  const { x, z } = chunk;
  const data = ChunkMap.of(0);
  const heightMap = data.map(generateHeightMap(generator.simplexHeightMap, x, z));
  const rainfall = data.map(generateRainfall(generator.simplexRainfall, x, z));
  const temperature = data.map(generateTemperature(generator.simplexTemperature, x, z));
  return pipeMonadic(
    chunk.setHeightMap(heightMap),
    chunk.setRainfall(rainfall),
    chunk.setTemperature(temperature),
    iterateChunk(pipeMonadic(
      generateCaves(generator),
      generateBiomeData,
      generateWater,
      generateResources(generator),
    )),
  )(chunk);
};

export const generateObjects = (generator: ChunkGenerator, chunk: Chunk): IO<Chunk> =>
  pipeMonadic(
    iterateChunk(pipeMonadic(generateBiomes(generator))),
    generateStructures(generator),
  )(chunk);

export default ChunkGenerator;
