import type { RenderToChunk, ChunkData } from './components/BasePropertiesComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';
import type { AABB } from '../physicsThread/physics/colliders/AABB';

export type BlockData = {
  id: number;
  fallSpeedCap: number;
  fallAcceleration: number;
  lightTransparent: boolean;
  sightTransparent: boolean;
  selfTransparent: boolean;
  needPhysics: boolean;
  baseRemoveTime: number;
  textures: {
    top: number;
    bottom: number;
    north: number;
    south: number;
    west: number;
    east: number;
  };
  buffer: {
    top: number;
    bottom: number;
    north: number;
    south: number;
    west: number;
    east: number;
  };
  putBlock: (
    chunk: ChunkData,
    x: number,
    y: number,
    z: number,
    value: number,
    plane: number,
  ) => boolean;
  getFlags: (flag: number) => number;
  getRotation: (flag: number) => number;
  renderToChunk: RenderToChunk;
  sounds: {
    footsteps: ReadonlyArray<string>;
  };
  name: string;
  collisionBox: AABB;
};

const Block = (...components: Partial<BlockData>[]): BlockData =>
  Object.assign({}, BasePropertiesComponent(), ...components);

export default Block;
