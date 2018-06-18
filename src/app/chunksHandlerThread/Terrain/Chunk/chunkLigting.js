// @flow
import { getIndex } from '../../../../../common/chunk';
import { SIGHT_TRANSPARENT } from '../../../blocks/blockInfo';
import {
  ROW,
  ROW_NESTED_CHUNK,
  COLUMN,
  COLUMN_NESTED_CHUNK,
  SLICE,
} from '../../../Terrain/Chunk/ChunkBase';
import {
  CHUNK_STATUS_NEED_LOAD_VBO,
  CHUNK_STATUS_LOADED,
} from '../../../Terrain/Chunk/chunkConstants';

const calcRecursion = (
  mask: number,
  reversedMask: number,
  dec: number,
  type: number, // TODO boolean?
) => {
  const calcCurrent = (
    chunk,
    x: number,
    y: number,
    z: number,
    index,
  ): number => (chunk.light[index] & reversedMask) | ((Math.max(
    (type ? 0 : (chunk.light[index] & mask)) + dec,
    ((z < 15) ? chunk.light[index + ROW] : chunk.eastChunk.light[index - ROW_NESTED_CHUNK]),
    ((z > 0) ? chunk.light[index - ROW] : chunk.westChunk.light[index + ROW_NESTED_CHUNK]),
    ((x < 15) ? chunk.light[index + COLUMN] : chunk.southChunk.light[index - COLUMN_NESTED_CHUNK]),
    ((x > 0) ? chunk.light[index - COLUMN] : chunk.northChunk.light[index + COLUMN_NESTED_CHUNK]),
    chunk.light[index + SLICE],
    chunk.light[index - SLICE],
  ) & mask) - dec);

  const updateIfLight = (
    index,
    lightTmp,
    chunk,
    ...params
  ) => {
    if (lightTmp > (chunk.light[index] & mask)) {
      calcRecursionInternal(chunk, ...params);
    }
  };

  const calcNear = (
    chunk,
    x: number,
    y: number,
    z: number,
    limit: number,
    index,
    lightTmp,
  ) => {
    if (z < 15) {
      updateIfLight(index + ROW, lightTmp, chunk, x, y, z + 1, limit);
    } else {
      updateIfLight(index - ROW_NESTED_CHUNK, lightTmp, chunk.eastChunk, x, y, 0, limit);
    }

    if (z > 0) {
      updateIfLight(index - ROW, lightTmp, chunk, x, y, z - 1, limit);
    } else {
      updateIfLight(index + ROW_NESTED_CHUNK, lightTmp, chunk.westChunk, x, y, 15, limit);
    }

    if (x < 15) {
      updateIfLight(index + COLUMN, lightTmp, chunk, x + 1, y, z, limit);
    } else {
      updateIfLight(index - COLUMN_NESTED_CHUNK, lightTmp, chunk.southChunk, 0, y, z, limit);
    }

    if (x > 0) {
      updateIfLight(index - COLUMN, lightTmp, chunk, x - 1, y, z, limit);
    } else {
      updateIfLight(index + COLUMN_NESTED_CHUNK, lightTmp, chunk.northChunk, 15, y, z, limit);
    }

    if (y < 255) {
      updateIfLight(index + SLICE, lightTmp, chunk, x, y + 1, z, limit);
    }

    if (y > 0) {
      updateIfLight(index - SLICE, lightTmp, chunk, x, y - 1, z, limit);
    }
  };

  const calcRecursionInternal = (
    chunk,
    x: number,
    y: number,
    z: number,
    limit: number,
  ) => {
    if (!limit) {
      return;
    }
    const index = getIndex(x, y, z);

    if (type) {
      const lightTmp = (chunk.light[index] & mask);
      if (chunk.blocks[index] && !chunk.blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]) {
        chunk.light[index] &= reversedMask;
      } else {
        chunk.light[index] = calcCurrent(chunk, x, y, z, index);
        if (chunk.state === CHUNK_STATUS_LOADED) {
          chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
        }
      }
      if (((chunk.light[index] & mask)) !== lightTmp) {
        calcNear(chunk, x, y, z, limit - 1, index, chunk.light[index] & mask);
      }
    } else if (chunk.blocks[index] && !chunk.blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]) {
      chunk.light[index] &= reversedMask;
    } else {
      chunk.light[index] = calcCurrent(chunk, x, y, z, index);
      if (chunk.state === CHUNK_STATUS_LOADED) {
        chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
      const lightTmp = (chunk.light[index] & mask) - dec;
      calcNear(chunk, x, y, z, limit - 1, index, lightTmp);
    }
  };
  return calcRecursionInternal;
};

export const calcRecursionRedRemove = calcRecursion(0xF000, 0x0FFF, 0x1000, 0);
export const calcRecursionGreenRemove = calcRecursion(0x0F00, 0xF0FF, 0x0100, 0);
export const calcRecursionBlueRemove = calcRecursion(0x00F0, 0xFF0F, 0x0010, 0);
export const calcRecursionGlobalRemove = calcRecursion(0x000F, 0xFFF0, 0x0001, 0);

export const calcRecursionRed = calcRecursion(0xF000, 0x0FFF, 0x1000, 1);
export const calcRecursionGreen = calcRecursion(0x0F00, 0xF0FF, 0x0100, 1);
export const calcRecursionBlue = calcRecursion(0x00F0, 0xFF0F, 0x0010, 1);
export const calcRecursionGlobal = calcRecursion(0x000F, 0xFFF0, 0x0001, 1);
