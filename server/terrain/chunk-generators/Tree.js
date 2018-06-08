// @flow
import Simplex from 'simplex-noise';
import seedrandom from 'seedrandom';
import type { Simplex3D } from '../../util/simplex';
import type Chunk from '../Chunk';
import Vector from '../../util/Vector';
import IO from '../../../common/fp/monads/io';

const PRNG = seedrandom.alea;

type Generator = {|
  +simplex: Simplex3D;
  +height: number;
|};

const leaves = (
  chunk: Chunk,
  position: Vector,
  lengthRemain: number,
): void => {
  if (!lengthRemain) {
    return;
  }
  const runRecursion = (vector: Vector) => {
    if (!chunk.at(...vector)) {
      chunk.setAt(...vector, 5);
      leaves(chunk, vector, lengthRemain - 1);
    }
  };
  const normalizedPosition = position.round();
  runRecursion(normalizedPosition.add(new Vector(0, 1, 0)));
  runRecursion(normalizedPosition.add(new Vector(0, -1, 0)));
  runRecursion(normalizedPosition.add(new Vector(1, 0, 0)));
  runRecursion(normalizedPosition.add(new Vector(-1, 0, 0)));
  runRecursion(normalizedPosition.add(new Vector(0, 0, 1)));
  runRecursion(normalizedPosition.add(new Vector(0, 0, -1)));
};

const branch = (
  chunk: Chunk,
  position: Vector,
  direction: Vector,
  length: number,
  branchingFactor: number,
  branchLengthRemain: number,
): void => {
  const BRANCH_LENGTH = 2;
  const runRecursion = (newPosition: Vector, newDirection: Vector, steps: number): void => {
    if (length) {
      branch(chunk, newPosition, newDirection, length - 1, branchingFactor, steps);
    }
    leaves(chunk, newPosition, 3);
  };
  if (length) {
    chunk.setAt(...position.round(), 4);
  }
  if (branchLengthRemain) {
    const newDirection = direction;
    const newPosition = position.add(newDirection);
    runRecursion(newPosition, newDirection, branchLengthRemain - 1);
  } else {
    const branches = Math.round(Math.random() * branchingFactor) + 1;
    const newDirection = direction.randomize(0.8);
    const newPosition = position.add(newDirection);
    runRecursion(newPosition, newDirection, BRANCH_LENGTH);
    const newDirection2 = newDirection.subtract(direction.multiply(2 * newDirection.dot(direction))).negative();
    const newPosition2 = position.add(newDirection2);
    runRecursion(newPosition2, newDirection2, BRANCH_LENGTH);
    if (branches === 3) {
      runRecursion(position.add(direction), direction, BRANCH_LENGTH);
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
      chunk.setAt(x, y + i, z, 4);
    }
    branch(chunk, new Vector(x, y + length, z), new Vector(0, 1, 0).unit(), length + 4, 1.9, 0);
    return chunk;
  });
};

export default generateTree;
