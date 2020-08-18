import type { Chunk } from './Chunk';
import type { Simplex2D, Simplex3D } from '../../util/simplex';
import type { generateTree } from './chunk-generators/Tree';
import type { generateStomp } from './chunk-generators/Stomp';
import type { generateSmallForestHouse1 } from './chunk-generators/houses/smallForestHouse1';

export type BlockPositionData = Readonly<{ chunk: Chunk; height: number; x: number; z: number }>;

export type IGenerator = (chunk: Chunk) => Chunk;

export type ChunkGenerator = Readonly<{
  seed: number;
  structures: IGenerator[];
  simplexHeightMapHills: Simplex2D;
  simplexHeightMapMountains: Simplex2D;
  simplexHeightMapRivers: Simplex2D;
  simplexTemperature: Simplex2D;
  simplexRainfall: Simplex2D;
  simplexFoliage: Simplex2D;
  simplexFoliageReeds: Simplex2D;
  simplexCaves: Simplex3D;
  simplexResourcesCoal: Simplex3D;
  simplexResourcesIron: Simplex3D;
  simplexResourcesClay: Simplex2D;
  generateTree: ReturnType<typeof generateTree>;
  generateStomp: ReturnType<typeof generateStomp>;
  houses: {
    smallForestHouse1: ReturnType<typeof generateSmallForestHouse1>;
  };
}>;

export enum BiomeType {
  desert,
  forest,
  hills,
}
