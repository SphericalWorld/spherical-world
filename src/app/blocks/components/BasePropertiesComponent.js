// @flow
import { getIndex } from '../../../../common/chunk';

const BasePropertiesComponent = () => ({
  fallSpeedCap: 0,
  fallAcceleration: 0.00002,
  textures: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },
  buffer: {
    top: 0,
    bottom: 0,
    north: 0,
    south: 0,
    west: 0,
    east: 0,
  },

  putBlock(chunk, x, y, z, value, plane) {
    chunk.flags[getIndex(x, y, z)] = this.getFlags(plane);
    if ((y !== 0) && (chunk.blocks[x + z * 16 + (y - 1) * 256] !== 128)) {
      chunk.blocks[x + z * 16 + y * 256] = value;
    }
  },

  getFlags(plane) {
    return plane;
  },
});

export default BasePropertiesComponent;
