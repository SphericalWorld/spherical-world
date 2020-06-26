import type { vec3 } from 'gl-matrix';
import { TERRAIN_HALF_SIZE_IN_BLOCKS } from './constants/chunk';
import HashMap from './fp/data-structures/Map';
// const k = index >>> 8;
// // const index2 = index & 0xFF;
// const i = (index >>> 4) & 0xF;
// const j = index & 0xF;
//

export const getGeoId = (x: number, z: number): string => `${x | 0}_${z | 0}`;

export const getIndex = (x: number, y: number, z: number) => x | (z << 4) | (y << 8);

export const toChunkPosition = (dimension: number): number => Math.floor(dimension / 16) * 16;

export const toPositionInChunk = (dimension: number) => Math.floor(dimension) & 0xF;

export const filterFarChunks = <T extends { x: number, z: number }>(
  oldPosition: type, newPosition: type, chunks: HashMap<string, T>,
): HashMap<string, T> => {
  const xOld = toChunkPosition(oldPosition[0]);
  const zOld = toChunkPosition(oldPosition[2]);
  const xNew = toChunkPosition(newPosition[0]);
  const zNew = toChunkPosition(newPosition[2]);
  return xNew === xOld && zNew === zOld
    ? chunks
    : new HashMap([...chunks.entries()].filter(([, { x, z }]) => (
      x > xNew - TERRAIN_HALF_SIZE_IN_BLOCKS)
      && (x < xNew + TERRAIN_HALF_SIZE_IN_BLOCKS)
      && (z > zNew - TERRAIN_HALF_SIZE_IN_BLOCKS)
      && (z < zNew + TERRAIN_HALF_SIZE_IN_BLOCKS)));
};
