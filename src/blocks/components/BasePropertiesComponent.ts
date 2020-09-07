import { vec3 } from 'gl-matrix';
import { getIndex } from '../../../common/chunk';
import identity from '../../../common/fp/combinators/identity';
import { SLICE } from '../../../common/constants/chunk';
import {
  footstepsGrass13,
  footstepsGrass15,
  footstepsGrass16,
  footstepsGrass18,
} from '../../sounds';
import type { BlockData } from '../Block';
import { createAABB } from '../../physicsThread/physics/colliders/AABB';

export type ChunkData = Readonly<{
  flags: Uint8Array;
  blocks: Uint8Array;
  light: Uint16Array;
  x: number;
  z: number;
}>;

export type RenderToChunk = (
  chunk: ChunkData,
  x: number,
  y: number,
  z: number,
  buffers: {
    vertexBuffer: number[];
    indexBuffer: number[];
    vertexCount: number;
  },
) => number;

const putBlock = (
  chunk: ChunkData,
  x: number,
  y: number,
  z: number,
  value: number,
  plane: number,
): boolean => {
  const index = getIndex(x, y, z);
  chunk.flags[index] = identity(plane);
  if (y !== 0 && chunk.blocks[index - SLICE] !== 128) {
    chunk.blocks[index] = value;
  }
  return true;
};

const BasePropertiesComponent = (): BlockData => ({
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
  getFlags: identity as (_: number) => number,
  getRotation: () => 0,
  sounds: {
    footsteps: [footstepsGrass13, footstepsGrass15, footstepsGrass16, footstepsGrass18],
  },
  name: 'Unnamed block',
  renderToChunk(
    chunk,
    x: number,
    y: number,
    z: number,
    { vertexBuffer, indexBuffer, vertexCount },
  ) {
    return this.model.render(chunk, x, y, z, { vertexBuffer, indexBuffer, vertexCount }, this.id);
  },
  collisionBox: createAABB(vec3.create(), vec3.fromValues(1, 1, 1)),
});

export default BasePropertiesComponent;
