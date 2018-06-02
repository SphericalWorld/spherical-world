// @flow
import Simplex from 'simplex-noise';
import seedrandom from 'seedrandom';

const PRNG = seedrandom.alea;

export type Simplex2D = (x: number, y: number) => number;
export type Simplex3D = (x: number, y: number, z: number) => number;

export const createSimplex3D = (seed: number, scale: number = 1): Simplex3D => {
  const simplex = new Simplex(PRNG(seed));
  return (x: number, y: number, z: number) => simplex.noise3D(x / scale, y / scale, z / scale);
};

export const createSimplex2D = (seed: number, scale: number = 1): Simplex2D => {
  const simplex = new Simplex(PRNG(seed));
  return (x: number, y: number) => simplex.noise2D(x / scale, y / scale);
};
