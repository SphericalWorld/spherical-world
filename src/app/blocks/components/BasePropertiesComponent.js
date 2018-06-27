// @flow
import { getIndex } from '../../../../common/chunk';
import identity from '../../../../common/fp/identity';
import { SLICE } from '../../Terrain/Chunk/ChunkBase';

const putBlock = (chunk, x: number, y: number, z: number, value: number, plane: number) => {
  const index = getIndex(x, y, z);
  chunk.flags[index] = this.getFlags(plane);
  if ((y !== 0) && (chunk.blocks[index - SLICE] !== 128)) {
    chunk.blocks[index] = value;
  }
};

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
  putBlock,
  getFlags: identity,
});

export default BasePropertiesComponent;
