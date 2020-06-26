import type {
  RenderToChunk,
  ChunkData,
} from './components/BasePropertiesComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

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
  getFlags: (number) => number;
  renderToChunk?: RenderToChunk;
};

const Block = <T>(...components: T[]): $Call<Object$Assign, BlockData, T> =>
  Object.assign({}, BasePropertiesComponent(), ...components);

export default Block;
