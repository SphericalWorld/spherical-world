// @flow strict
declare module 'simplex-noise' {
  declare export default class SimplexNoise {
    constructor(random?: () => number | string): SimplexNoise;
    noise2D(x: number, y: number): number;
    noise3D(x: number, y: number, z: number): number;
    noise4D(x: number, y: number, z: number, w: number): number;
  }
}
