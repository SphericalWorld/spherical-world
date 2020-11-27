import ChunkMap from './ChunkMap';
import type { Terrain } from './Terrain';
// import type { ChunkGenerator } from '../threads/chunkGenerator/ChunkGenerator';
import { getGeoId } from '../../common/chunk';

// just to have proper class shape before we get actual data, so we won't get multiple hidden classes
const temporaryArrayBuffer = new SharedArrayBuffer(0);

const emptyHeightMap = ChunkMap.of(0).map(() => 0);

export class ChunkBase {
  terrain: Terrain;
  x: number;
  z: number;
  geoId: string;
  fileName: string;
  metaFileName: string;
  filePath: string;
  metaPath: string;
  data: Uint8Array;
  dataBuffer: SharedArrayBuffer;
  flags: Uint8Array;
  flagsBuffer: SharedArrayBuffer;
  // chunkGenerator: ChunkGenerator;
  changesCount = 0;
  terrainGenerated = false;
  objectsGenerated = false;
  northChunk: ChunkBase = this;
  southChunk: ChunkBase = this;
  westChunk: ChunkBase = this;
  eastChunk: ChunkBase = this;
  heightMap: ChunkMap<number> = emptyHeightMap;
  rainfall: ChunkMap<number> = emptyHeightMap;
  temperature: ChunkMap<number> = emptyHeightMap;

  constructor(
    terrain: Terrain,
    x: number,
    z: number,
    dataBuffer: SharedArrayBuffer = temporaryArrayBuffer,
    flagsBuffer: SharedArrayBuffer = temporaryArrayBuffer,
  ) {
    this.terrain = terrain;
    this.x = x;
    this.z = z;
    this.chunkGenerator = terrain.chunkGenerator;
    this.geoId = getGeoId(x, z);
    this.fileName = `${this.geoId}.bin`;
    this.metaFileName = `${this.geoId}.meta.json`;
    this.filePath = `./map/${terrain.locationName}/${this.fileName}`;
    this.metaPath = `./map/${terrain.locationName}/${this.metaFileName}`;
    this.dataBuffer = dataBuffer;
    this.data = new Uint8Array(dataBuffer);
    this.flagsBuffer = flagsBuffer;
    this.flags = new Uint8Array(flagsBuffer);

    const northChunk = terrain.chunks.get(getGeoId(x - 16, z));
    const southChunk = terrain.chunks.get(getGeoId(x + 16, z));
    const westChunk = terrain.chunks.get(getGeoId(x, z - 16));
    const eastChunk = terrain.chunks.get(getGeoId(x, z + 16));
    if (northChunk) {
      this.northChunk = northChunk;
      northChunk.southChunk = this;
    }
    if (southChunk) {
      this.southChunk = southChunk;
      southChunk.northChunk = this;
    }
    if (westChunk) {
      this.westChunk = westChunk;
      westChunk.eastChunk = this;
    }
    if (eastChunk) {
      this.eastChunk = eastChunk;
      eastChunk.westChunk = this;
    }
  }
}
