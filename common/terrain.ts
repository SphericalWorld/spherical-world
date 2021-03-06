import type { vec4 } from 'gl-matrix';
import type { Block } from './blocks';
import { toChunkPosition, toPositionInChunk, getIndex } from './chunk';

const RED_LIGHT_BIT_SHIFT: 12 = 12;
const GREEN_COLOR_BIT_SHIFT: 8 = 8;
const BLUE_COLOR_BIT_SHIFT: 4 = 4;
const SUN_COLOR_BIT_SHIFT: 0 = 0;

type ColorComponentBitShifts =
  | typeof RED_LIGHT_BIT_SHIFT
  | typeof GREEN_COLOR_BIT_SHIFT
  | typeof BLUE_COLOR_BIT_SHIFT
  | typeof SUN_COLOR_BIT_SHIFT;

export const getColorComponent = (light: number, shift: ColorComponentBitShifts): number =>
  0.8 ** (15 - ((light >>> shift) & 0xf));

export const getColorComponents = (light: number): vec4 => [
  getColorComponent(light, RED_LIGHT_BIT_SHIFT),
  getColorComponent(light, GREEN_COLOR_BIT_SHIFT),
  getColorComponent(light, BLUE_COLOR_BIT_SHIFT),
  getColorComponent(light, SUN_COLOR_BIT_SHIFT),
];

export const getBlock = (terrain) => (x: number, y: number, z: number): Block | undefined => {
  const chunk = terrain.getChunk(toChunkPosition(x), toChunkPosition(z));
  if (chunk) {
    return chunk.getBlock(toPositionInChunk(x), Math.floor(y), toPositionInChunk(z));
  }
};

/**
 * Return light level at given `WORLD` coordinates
 * @param {Terrain} terrain to get light from
 * @param {number} x in world coordinates
 * @param {number} y in world coordinates
 * @param {number} z in world coordinates
 * @returns {(x: number, y: number, z: number) => vec4 | void} value of light at given position
 */
export const getLight = (terrain) => (x: number, y: number, z: number): vec4 | void => {
  const chunk = terrain.getChunk(toChunkPosition(x), toChunkPosition(z));
  if (chunk) {
    return getColorComponents(
      chunk.light[getIndex(toPositionInChunk(x), Math.floor(y), toPositionInChunk(z))],
    );
  }
};
