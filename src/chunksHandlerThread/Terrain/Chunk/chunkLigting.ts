import { getIndex } from '../../../../common/chunk';
import { SIGHT_TRANSPARENT, blocksFlags } from '../../../blocks/blockInfo';
import {
  ROW,
  ROW_NESTED_CHUNK,
  COLUMN,
  COLUMN_NESTED_CHUNK,
  SLICE,
} from '../../../../common/constants/chunk';
import {
  CHUNK_STATUS_NEED_LOAD_VBO,
  CHUNK_STATUS_LOADED,
} from '../../../Terrain/Chunk/chunkConstants';
import type Chunk from './Chunk';

const calcRecursion = (
  mask: number,
  reversedMask: number,
  dec: number,
  mode: number, // TODO boolean?
) => {
  const calcCurrent = (
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
    index: number,
  ): number =>
    (chunk.light[index] & reversedMask) |
    (Math.max(
      (mode ? chunk.light[index] & mask : 0) + dec,
      (z < 15
        ? chunk.light[index + ROW]
        : chunk.eastChunk.light[index - ROW_NESTED_CHUNK]) & mask,
      (z > 0
        ? chunk.light[index - ROW]
        : chunk.westChunk.light[index + ROW_NESTED_CHUNK]) & mask,
      (x < 15
        ? chunk.light[index + COLUMN]
        : chunk.southChunk.light[index - COLUMN_NESTED_CHUNK]) & mask,
      (x > 0
        ? chunk.light[index - COLUMN]
        : chunk.northChunk.light[index + COLUMN_NESTED_CHUNK]) & mask,
      chunk.light[index + SLICE] & mask,
      chunk.light[index - SLICE] & mask,
    ) -
      dec);

  const updateIfLightAdd = (
    index: number,
    lightTmp,
    chunk: Chunk,
    ...params
  ) => {
    if (lightTmp > (chunk.light[index] & mask)) {
      if (chunk.state === CHUNK_STATUS_LOADED) {
        chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
      chunk.light[index] = (chunk.light[index] & reversedMask) | lightTmp;
      calcRecursionInternal(chunk, ...params);
    }
  };

  const updateIfLightRemove = (index, lightTmp, chunk: Chunk, ...params) =>
    lightTmp > (chunk.light[index] & mask) &&
    calcRecursionRemoveInternal(chunk, ...params);

  const updateIfLight = mode ? updateIfLightAdd : updateIfLightRemove;

  const calcNear = (
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
    index: number,
    lightTmp: number,
    limit: number,
  ) => (
    z < 15
      ? updateIfLight(index + ROW, lightTmp, chunk, x, y, z + 1, limit)
      : updateIfLight(
          index - ROW_NESTED_CHUNK,
          lightTmp,
          chunk.eastChunk,
          x,
          y,
          0,
          limit,
        ),
    z > 0
      ? updateIfLight(index - ROW, lightTmp, chunk, x, y, z - 1, limit)
      : updateIfLight(
          index + ROW_NESTED_CHUNK,
          lightTmp,
          chunk.westChunk,
          x,
          y,
          15,
          limit,
        ),
    x < 15
      ? updateIfLight(index + COLUMN, lightTmp, chunk, x + 1, y, z, limit)
      : updateIfLight(
          index - COLUMN_NESTED_CHUNK,
          lightTmp,
          chunk.southChunk,
          0,
          y,
          z,
          limit,
        ),
    x > 0
      ? updateIfLight(index - COLUMN, lightTmp, chunk, x - 1, y, z, limit)
      : updateIfLight(
          index + COLUMN_NESTED_CHUNK,
          lightTmp,
          chunk.northChunk,
          15,
          y,
          z,
          limit,
        ),
    y < 255 &&
      updateIfLight(index + SLICE, lightTmp, chunk, x, y + 1, z, limit),
    y > 0 && updateIfLight(index - SLICE, lightTmp, chunk, x, y - 1, z, limit)
  );

  const calcRecursionInternal = (
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
    limit = 0,
  ) => {
    if (!limit) {
      return;
    }
    const index = getIndex(x, y, z);
    if (
      chunk.blocks[index] &&
      !blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]
    ) {
      chunk.light[index] &= reversedMask;
    } else {
      chunk.light[index] = calcCurrent(chunk, x, y, z, index);
      calcNear(
        chunk,
        x,
        y,
        z,
        index,
        (chunk.light[index] & mask) - dec,
        limit - 1,
      );
    }
  };

  const calcRecursionRemoveInternal = (
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
    limit = 0,
  ) => {
    if (!limit) {
      return;
    }
    const index = getIndex(x, y, z);
    const lightTmp = chunk.light[index];
    if (
      chunk.blocks[index] &&
      !blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]
    ) {
      chunk.light[index] &= reversedMask;
    } else {
      chunk.light[index] = calcCurrent(chunk, x, y, z, index);
      if (chunk.state === CHUNK_STATUS_LOADED) {
        chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
    }
    if (chunk.light[index] !== lightTmp) {
      calcNear(chunk, x, y, z, index, chunk.light[index] & mask, limit - 1);
    }
  };

  return mode ? calcRecursionInternal : calcRecursionRemoveInternal;
};

export const calcRecursionRedRemove = calcRecursion(0xf000, 0x0fff, 0x1000, 0);
export const calcRecursionGreenRemove = calcRecursion(
  0x0f00,
  0xf0ff,
  0x0100,
  0,
);
export const calcRecursionBlueRemove = calcRecursion(0x00f0, 0xff0f, 0x0010, 0);
export const calcRecursionGlobalRemove = calcRecursion(
  0x000f,
  0xfff0,
  0x0001,
  0,
);

export const calcRecursionRed = calcRecursion(0xf000, 0x0fff, 0x1000, 1);
export const calcRecursionGreen = calcRecursion(0x0f00, 0xf0ff, 0x0100, 1);
export const calcRecursionBlue = calcRecursion(0x00f0, 0xff0f, 0x0010, 1);
export const calcRecursionGlobal = calcRecursion(0x000f, 0xfff0, 0x0001, 1);
