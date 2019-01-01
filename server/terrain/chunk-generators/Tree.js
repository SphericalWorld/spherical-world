// @flow strict
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import Simplex from 'simplex-noise';
import seedrandom from 'seedrandom';
import type { Simplex3D } from '../../util/simplex';
import type Chunk from '../Chunk';
import IO from '../../../common/fp/monads/io';
import { randomize } from '../../../common/utils/vector';

const PRNG = seedrandom.alea;

type Generator = {|
  +simplex: Simplex3D;
  +height: number;
|};

const EAST = vec3.fromValues(1, 0, 0);
const WEST = vec3.fromValues(-1, 0, 0);
const TOP = vec3.fromValues(0, 1, 0);
const BOTTOM = vec3.fromValues(0, -1, 0);
const NORTH = vec3.fromValues(0, 0, 1);
const SOUTH = vec3.fromValues(0, 0, -1);

const leaves = (
  chunk: Chunk,
  position: Vec3,
  lengthRemain: number,
): void => {
  if (!lengthRemain) {
    return;
  }
  const runRecursion = (vector: Vec3) => {
    if (!chunk.at(vector[0], vector[1], vector[2])) {
      chunk.setUnsafe(vector[0], vector[1], vector[2], 5);
      leaves(chunk, vector, lengthRemain - 1);
    }
  };
  const normalizedPosition = vec3.round(vec3.create(), position);
  const nextPosition = vec3.create();
  runRecursion(vec3.add(nextPosition, normalizedPosition, TOP));
  runRecursion(vec3.add(nextPosition, normalizedPosition, BOTTOM));
  runRecursion(vec3.add(nextPosition, normalizedPosition, EAST));
  runRecursion(vec3.add(nextPosition, normalizedPosition, WEST));
  runRecursion(vec3.add(nextPosition, normalizedPosition, NORTH));
  runRecursion(vec3.add(nextPosition, normalizedPosition, SOUTH));
};

const branch = (
  chunk: Chunk,
  position: Vec3,
  direction: Vec3,
  length: number,
  branchingFactor: number,
  branchLengthRemain: number,
): void => {
  const BRANCH_LENGTH = 2;
  const runRecursion = (newPosition: Vec3, newDirection: Vec3, steps: number): void => {
    if (length) {
      branch(chunk, newPosition, newDirection, length - 1, branchingFactor, steps);
    }
    leaves(chunk, newPosition, 3);
  };
  if (length) {
    chunk.setUnsafe(...vec3.round(vec3.create(), position), 4);
  }
  if (branchLengthRemain) {
    const newDirection = direction;
    const newPosition = vec3.add(vec3.create(), position, newDirection);
    runRecursion(newPosition, newDirection, branchLengthRemain - 1);
  } else {
    const branches = Math.round(Math.random() * branchingFactor) + 1;
    const newDirection = randomize(vec3.create(), direction, 0.8);
    const newPosition = vec3.add(vec3.create(), position, newDirection);
    runRecursion(newPosition, newDirection, BRANCH_LENGTH);

    const newDirection2 = vec3.negate(vec3.create(), vec3.scaleAndAdd(vec3.create(), newDirection, direction, -2 * vec3.dot(newDirection, direction)));
    const newPosition2 = vec3.add(vec3.create(), position, newDirection2);
    runRecursion(newPosition2, newDirection2, BRANCH_LENGTH);

    if (branches === 3) {
      runRecursion(vec3.add(vec3.create(), position, direction), direction, BRANCH_LENGTH);
    }
  }
};

const generateTree = (seed: number) => {
  const simplex = new Simplex(PRNG(seed));
  const generator: Generator = {
    simplex,
    height: 5,
  };

  return (
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
  ): IO<Chunk> => IO.from(() => {
    const length = Math.floor(generator.simplex.noise2D(x, z) * 3) + 5;
    for (let i = 0; i < length; i += 1) {
      chunk.setUnsafe(x, y + i, z, 4);
    }
    branch(chunk, vec3.fromValues(x, y + length, z), TOP, length + 4, 1.9, 0);
    return chunk;
  });
};

export default generateTree;
