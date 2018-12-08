// @flow strict
import { getIndex } from '../../../common/chunk';
import identity from '../../../common/fp/combinators/identity';
import { SLICE } from '../../../common/constants/chunk';

const putBlock = (
  chunk,
  x: number,
  y: number,
  z: number,
  value: number,
  plane: number,
): boolean => {
  const index = getIndex(x, y, z);
  chunk.flags[index] = this.getFlags(plane);
  if ((y !== 0) && (chunk.blocks[index - SLICE] !== 128)) {
    chunk.blocks[index] = value;
  }
  return true;
};

const BasePropertiesComponent = () => ({
  id: 0,
  fallSpeedCap: Number.MIN_SAFE_INTEGER,
  fallAcceleration: 1,
  lightTransparent: false,
  sightTransparent: false,
  selfTransparent: false,
  needPhysics: true,
  baseRemoveTime: 1,
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
  renderToChunk: null,
});

export default BasePropertiesComponent;
