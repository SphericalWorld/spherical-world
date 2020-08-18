import type { vec3 } from 'gl-matrix';
import type { Chunk } from '../Chunk';

export const fillVolume = (
  chunk: Chunk,
  start: vec3,
  end: vec3,
  block: number,
  rotationData,
): void => {
  for (let i = start[0]; i <= end[0]; i += 1) {
    for (let j = start[1]; j <= end[1]; j += 1) {
      for (let k = start[2]; k <= end[2]; k += 1) {
        chunk.setAtNoFlagsAndRotate(i, j, k, block, rotationData);
      }
    }
  }
};
