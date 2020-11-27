import { readFile, outputFile } from 'fs-extra';
import type ChunkMap from './ChunkMap';
import { ChunkBase } from './ChunkBase';

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
  chunkGenerator: ChunkGenerator;
  changesCount = 0;
  terrainGenerated = false;
  objectsGenerated = false;
  northChunk: Chunk = this;
  southChunk: Chunk = this;
  westChunk: Chunk = this;
  eastChunk: Chunk = this;

  async load(): Promise<Chunk> {
    this.data = await readFile(this.filePath);
    return this;
  }

  async getCompressedData(): Promise<Buffer> {
    const totalLength = this.data.byteLength + this.flags.byteLength;
    return Buffer.concat(
      [
        Buffer.from(this.data, 0, this.data.byteLength),
        Buffer.from(this.flags, 0, this.flags.byteLength),
      ],
      totalLength,
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

  setData(dataBuffer: SharedArrayBuffer, flagsBuffer: SharedArrayBuffer): void {
    this.dataBuffer = dataBuffer;
    this.data = new Uint8Array(this.dataBuffer);
    this.flagsBuffer = flagsBuffer;
    this.flags = new Uint8Array(this.flagsBuffer);
  }
}

export default Chunk;
