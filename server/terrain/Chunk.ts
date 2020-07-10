import { promisify } from 'util';
import { readFile, outputFile } from 'fs-extra';
import zlib from 'zlib';
import type ChunkMap from './ChunkMap';
import type { Terrain } from './Terrain';
// import type { ChunkGenerator } from '../threads/chunkGenerator/ChunkGenerator';
import { BLOCKS_IN_CHUNK } from '../../common/constants/chunk';
import { profileChunkGeneration } from '../../common/profileUtils';
// import { generate, generateObjects } from '../threads/chunkGenerator/ChunkGenerator';
import { getGeoId } from '../../common/chunk';
import { ChunkBase } from './ChunkBase';

const profileChunkGenerationFoliage = profileChunkGeneration('Foliage generation');
const deflate: (data: Buffer) => Promise<Buffer> = promisify(zlib.deflate);

const getChunkNear = (chunk: Chunk, x: number, y: number, z: number): Chunk => {
  let chunkTo = chunk;
  if (x < chunk.x) {
    chunkTo = chunkTo.northChunk;
  } else if (x > chunk.x + 15) {
    chunkTo = chunkTo.southChunk;
  }
  if (z < chunk.z) {
    chunkTo = chunkTo.westChunk;
  } else if (z > chunk.z + 15) {
    chunkTo = chunkTo.eastChunk;
  }
  return chunkTo;
};

type ChunkMetaData = {
  objectsGenerated: boolean;
  dataLength: number;
};

class Chunk extends ChunkBase {
  terrain: Terrain;
  fileName: string;
  metaFileName: string;
  filePath: string;
  metaPath: string;
  chunkGenerator: ChunkGenerator;
  changesCount = 0;
  terrainGenerated = false;
  objectsGenerated = false;
  northChunk: Chunk = this;
  southChunk: Chunk = this;
  westChunk: Chunk = this;
  eastChunk: Chunk = this;
  heightMap: ChunkMap<number>;
  rainfall: ChunkMap<number>;
  temperature: ChunkMap<number>;

  constructor(terrain: Terrain, x: number, z: number) {
    super(terrain, x, z);
    // this.terrain = terrain;
    // this.x = x;
    // this.z = z;
    // this.chunkGenerator = terrain.chunkGenerator;
    // this.geoId = getGeoId(x, z);
    // this.fileName = `${this.geoId}.bin`;
    // this.metaFileName = `${this.geoId}.meta.json`;
    // this.filePath = `./map/${this.terrain.locationName}/${this.fileName}`;
    // this.metaPath = `./map/${this.terrain.locationName}/${this.metaFileName}`;
  }

  async load(): Promise<Chunk> {
    this.data = await readFile(this.filePath);
    return this;
  }

  async getCompressedData(): Promise<Buffer> {
    const totalLength = this.data.byteLength + this.flags.length;
    return deflate(
      Buffer.concat([Buffer.from(this.data, 0, this.data.byteLength), this.flags], totalLength),
    );
  }

  async save(): Promise<Chunk> {
    await outputFile(this.filePath, this.data);
    // await appendFile(this.filePath, this.flags);
    this.saveMeta({
      objectsGenerated: this.objectsGenerated,
      dataLength: this.data.length,
    });
    return this;
  }

  async saveMeta(meta: ChunkMetaData): Promise<Chunk> {
    await outputFile(this.metaPath, JSON.stringify(meta));
    return this;
  }

  setAt(x: number, y: number, z: number, block: number | [number, number]): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    if (typeof block === 'number') {
      chunk.data[index] = block;
    } else {
      const [data, flags] = block;
      chunk.data[index] = data;
      chunk.flags[index] = flags;
    }
  }

  setAtSameChunkOnly(x: number, y: number, z: number, block: number | [number, number]): void {
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    if (typeof block === 'number') {
      this.data[index] = block;
    } else {
      const [data, flags] = block;
      this.data[index] = data;
      this.flags[index] = flags;
    }
  }

  at(x: number, y: number, z: number): number {
    return getChunkNear(this, x, y, z).data[(x & 0xf) | ((z & 0xf) << 4) | (y << 8)];
  }

  setHeightMap(heightMap: ChunkMap<number>): void {
    this.heightMap = heightMap;
  }

  setRainfall(rainfall: ChunkMap<number>): void {
    this.rainfall = rainfall;
  }

  setTemperature(temperature: ChunkMap<number>): void {
    this.temperature = temperature;
  }

  setData(dataBuffer: SharedArrayBuffer): void {
    this.dataBuffer = dataBuffer;
    this.data = new Uint8Array(this.dataBuffer);
  }
}

export default Chunk;
