import Simplex from 'simplex-noise';
import seedrandom from 'seedrandom';
import type { Chunk } from '../../Chunk';
import { AIR, OAK, PLANKS, STONE_BRICK, WOODEN_SLAB } from '../../../../../common/blocks';
import { fillVolume } from '../helpers';

const PRNG = seedrandom.alea;

type Generator = Readonly<{
  simplex: Simplex;
  height: number;
}>;

const findPosition = (chunk: Chunk) => {
  const xStart = chunk.x;
  const xEnd = chunk.x + 9;
  const zStart = chunk.z;
  const zEnd = chunk.z + 9;
  const y = Math.min(
    chunk.heightMap.get(0, 0),
    chunk.heightMap.get(0, 15),
    chunk.heightMap.get(15, 0),
    chunk.heightMap.get(15, 15),
  );

  return {
    xStart,
    xEnd,
    zStart,
    zEnd,
    y,
  };
};

// const base = (y)
const getFlagByAngle = (angle: 0 | 90 | 180 | 270) => {
  if (angle === 90 || angle === 270) return 4;
  return 2;
};

const wall = (chunk: Chunk, x: number, y: number, z: number, rotationData) => {
  const oakHorizontalFlag = getFlagByAngle(rotationData.angle);
  for (let index = 0; index < 3; index += 1) {
    chunk.setAtWithFlagsAndRotate(x + index, y, z, OAK, oakHorizontalFlag, rotationData);
    chunk.setAtWithFlagsAndRotate(x + index, y + 4, z, OAK, oakHorizontalFlag, rotationData);
    chunk.setAtNoFlagsAndRotate(x + index, y + 1, z, PLANKS, rotationData);
    chunk.setAtNoFlagsAndRotate(x + index, y + 3, z, PLANKS, rotationData);
  }
  chunk.setAtNoFlagsAndRotate(x + 0, y + 2, z, PLANKS, rotationData);
  chunk.setAtNoFlagsAndRotate(x + 2, y + 2, z, PLANKS, rotationData);
};

const getFlagByAngleEW = (angle: 0 | 90 | 180 | 270) => {
  if (angle === 90 || angle === 270) return 2;
  return 4;
};

const wallEW = (chunk: Chunk, x: number, y: number, z: number, rotationData) => {
  const oakHorizontalFlag = getFlagByAngleEW(rotationData.angle);
  for (let index = 0; index < 3; index += 1) {
    chunk.setAtWithFlagsAndRotate(x, y, z + index, OAK, oakHorizontalFlag, rotationData);
    chunk.setAtWithFlagsAndRotate(x, y + 4, z + index, OAK, oakHorizontalFlag, rotationData);
    chunk.setAtNoFlagsAndRotate(x, y + 1, z + index, PLANKS, rotationData);
    chunk.setAtNoFlagsAndRotate(x, y + 3, z + index, PLANKS, rotationData);
  }
  chunk.setAtNoFlagsAndRotate(x, y + 2, z + 0, PLANKS, rotationData);
  chunk.setAtNoFlagsAndRotate(x, y + 2, z + 2, PLANKS, rotationData);
};

const column = (chunk: Chunk, x: number, y: number, z: number, rotationData) => {
  for (let index = 0; index < 5; index += 1) {
    chunk.setAtNoFlagsAndRotate(x, y + index, z, OAK, rotationData);
  }
};

const generate = (generator, chunk: Chunk) => {
  const { xStart, xEnd, zStart, zEnd, y } = findPosition(chunk);
  const angle = 90;
  const width = 16;
  const height = 16;
  const rotationData = { angle, dimensions: [width, height] } as const;

  column(chunk, 1, y, 1, rotationData);
  wall(chunk, 2, y, 1, rotationData);
  column(chunk, 5, y, 1, rotationData);
  wall(chunk, 6, y, 1, rotationData);
  column(chunk, 9, y, 1, rotationData);

  // wall(chunk, 9, y, 4, rotationData);
  // column(chunk, 12, y, 4, rotationData);

  column(chunk, 1, y, 9, rotationData);

  column(chunk, 5, y, 9, rotationData);
  wall(chunk, 6, y, 9, rotationData);
  column(chunk, 9, y, 9, rotationData);
  wall(chunk, 10, y, 9, rotationData);
  column(chunk, 13, y, 9, rotationData);
  wall(chunk, 10, y, 5, rotationData);
  chunk.setAtNoFlagsAndRotate(11, y + 1, 5, AIR, rotationData);

  wallEW(chunk, 1, y, 2, rotationData);
  column(chunk, 1, y, 5, rotationData);
  wallEW(chunk, 1, y, 6, rotationData);

  wallEW(chunk, 9, y, 2, rotationData);
  column(chunk, 9, y, 5, rotationData);
  wallEW(chunk, 13, y, 6, rotationData);
  column(chunk, 13, y, 5, rotationData);

  fillVolume(chunk, [2, y, 2], [8, y, 8], PLANKS, rotationData);
  fillVolume(chunk, [9, y, 6], [12, y, 8], PLANKS, rotationData);
  fillVolume(chunk, [10, y, 1], [13, y, 4], PLANKS, rotationData);

  fillVolume(chunk, [2, y + 1, 2], [8, y + 4, 8], AIR, rotationData);
  fillVolume(chunk, [9, y + 1, 6], [12, y + 4, 8], AIR, rotationData);

  // chimney
  fillVolume(chunk, [2, y, 8], [4, y, 10], STONE_BRICK, rotationData);
  fillVolume(chunk, [2, y + 1, 9], [4, y + 3, 10], STONE_BRICK, rotationData);
  fillVolume(chunk, [3, y + 4, 9], [3, y + 7, 10], STONE_BRICK, rotationData);
  const oakHorizontalFlag = getFlagByAngle(rotationData.angle);

  chunk.setAtWithFlagsAndRotate(2, y + 4, 9, OAK, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(4, y + 4, 9, OAK, oakHorizontalFlag, rotationData);
  // entrance
  chunk.setAtWithFlagsAndRotate(10, y, 1, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(11, y, 1, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(12, y, 1, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(13, y, 2, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(13, y, 3, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtWithFlagsAndRotate(13, y, 4, WOODEN_SLAB, oakHorizontalFlag, rotationData);
  chunk.setAtNoFlagsAndRotate(13, y, 1, OAK, rotationData);
};

export const generateSmallForestHouse1 = (seed: number): ((chunk: Chunk) => Chunk) => {
  const simplex = new Simplex(PRNG(`${seed}`));
  const generator: Generator = {
    simplex,
    height: 5,
  };

  return (chunk: Chunk): Chunk => {
    if (chunk.generationFlags.forestHouseGenerated) return chunk;
    if (simplex.noise2D(chunk.x * 10, chunk.z * 10) < 0.8) {
      return chunk;
    }
    chunk.generationFlags.forestHouseGenerated = true;
    generate(generator, chunk);
    return chunk;
  };
};
