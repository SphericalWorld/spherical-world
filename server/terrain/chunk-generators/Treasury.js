// @flow
import Simplex from 'simplex-noise';
import seedrandom from 'seedrandom';
import type { Simplex3D } from '../../util/simplex';
import type Chunk from '../Chunk';
import {
  TORCH, COBBLESTONE, AIR, WATER,
} from '../../../common/blocks';
import IO from '../../../common/fp/monads/io';

const PRNG = seedrandom.alea;

type Generator = {|
  +simplex: Simplex3D;
  +height: number;
|};

const findPosition = (chunk: Chunk) => {
  const xStart = chunk.x;
  const xEnd = chunk.x + 9;
  const zStart = chunk.z;
  const zEnd = chunk.z + 9;
  let y = 255;
  while (y > 0 && ([AIR, WATER].includes(chunk.at(xStart, y, zStart))
    || [AIR, WATER].includes(chunk.at(xStart, y, zEnd))
    || [AIR, WATER].includes(chunk.at(xEnd, y, zStart))
    || [AIR, WATER].includes(chunk.at(xEnd, y, zEnd))
  )) {
    y -= 1;
  }
  y -= 2;
  return {
    xStart, xEnd, zStart, zEnd, y,
  };
};

const generateRoom = (generator, chunk: Chunk) => {
  const {
    xStart, xEnd, zStart, zEnd, y,
  } = findPosition(chunk);
  for (let i = y; i > y - generator.height; i -= 1) {
    for (let j = xStart; j < xEnd; j += 1) {
      for (let k = zStart; k < zEnd; k += 1) {
        if (j === xStart || j === xEnd - 1 || k === zStart || k === zEnd - 1) {
          chunk.setUnsafe(j, i, k, COBBLESTONE);
        } else {
          chunk.setUnsafe(j, i, k, AIR);
        }
      }
    }
  }

  chunk.setUnsafe(xEnd - 2, y - 2, zStart + 4, [TORCH, 2]);
  chunk.setUnsafe(xStart + 1, y - 2, zStart + 4, [TORCH, 3]);
  chunk.setUnsafe(xStart + 4, y - 2, zEnd - 2, [TORCH, 4]);
  chunk.setUnsafe(xStart + 4, y - 2, zStart + 1, [TORCH, 5]);


  for (let i = xStart; i < xEnd; i += 1) {
    for (let j = zStart; j < zEnd; j += 1) {
      chunk.setUnsafe(i, y - generator.height, j, 16);
    }
  }
};

// TODO use Maybe monad?
const generateTreasury = (seed: number) => {
  const simplex = new Simplex(PRNG(seed));
  const generator: Generator = {
    simplex,
    height: 5,
  };

  return (chunk: Chunk): IO<Chunk> => IO.from(() => {
    if (simplex.noise2D(chunk.x * 10, chunk.z * 10) < 0.5) {
      return chunk;
    }
    generateRoom(generator, chunk);
    return chunk;
  });
};

export default generateTreasury;
