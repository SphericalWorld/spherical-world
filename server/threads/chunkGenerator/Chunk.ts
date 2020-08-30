import { readFile, outputFile } from 'fs-extra';
import type ChunkMap from '../../terrain/ChunkMap';
import type { Terrain } from './Terrain';
import { BLOCKS_IN_CHUNK } from '../../../common/constants/chunk';
import { profileChunkGeneration } from '../../../common/profileUtils';
import { generate, generateObjects } from './ChunkGenerator';
import { ChunkBase } from '../../terrain/ChunkBase';

const profileChunkGenerationBase = profileChunkGeneration();
const profileChunkGenerationFoliage = profileChunkGeneration('Foliage generation');

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

export class Chunk extends ChunkBase {
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
  generationFlags: { [key: string]: boolean } = {};

  async load(): Promise<Chunk> {
    this.data = await readFile(this.filePath);
    return this;
  }

  async generate(): Promise<Chunk> {
    if (this.terrainGenerated) {
      return this;
    }
    this.dataBuffer = new SharedArrayBuffer(BLOCKS_IN_CHUNK);
    this.data = new Uint8Array(this.dataBuffer);
    this.flagsBuffer = new SharedArrayBuffer(BLOCKS_IN_CHUNK);
    this.flags = new Uint8Array(this.flagsBuffer);

    await new Promise((resolve) => {
      generate(this.chunkGenerator, this);
      profileChunkGenerationBase();
      resolve();
    });
    // await this.northChunk.generateObjects();
    // await this.southChunk.generateObjects();
    // await this.westChunk.generateObjects();
    // await this.eastChunk.generateObjects();
    // await this.northChunk.westChunk.generateObjects();
    // await this.northChunk.westChunk.generateObjects();
    // await this.southChunk.westChunk.generateObjects();
    // await this.southChunk.eastChunk.generateObjects();

    // if (this.northChunk) {
    //   await this.northChunk.generateObjects();
    //   if (this.northChunk.westChunk) {
    //     await this.northChunk.westChunk.generateObjects();
    //   }
    //   if (this.northChunk.westChunk) {
    //     await this.northChunk.westChunk.generateObjects();
    //   }
    // }
    // if (this.southChunk) {
    //   await this.southChunk.generateObjects();
    //   if (this.southChunk.westChunk) {
    //     await this.southChunk.westChunk.generateObjects();
    //   }
    //   if (this.southChunk.eastChunk) {
    //     await this.southChunk.eastChunk.generateObjects();
    //   }
    // }
    // if (this.westChunk) {
    //   await this.westChunk.generateObjects();
    // }
    // if (this.eastChunk) {
    //   await this.eastChunk.generateObjects();
    // }
    this.terrainGenerated = true;
    return this;
  }

  async generateWithSurrounding(depth: number): Promise<Chunk> {
    // if (!depth) {
    //   return this;
    // }
    // const [
    //   northChunk,
    //   southChunk,
    //   westChunk,
    //   eastChunk,
    //   northWestChunk,
    //   northEastChunk,
    //   southWestChunk,
    //   southEastChunk,
    // ] =
    const chunks = await Promise.all([
      this.terrain.ensureChunk(this.x - 16, this.z),
      this.terrain.ensureChunk(this.x + 16, this.z),
      this.terrain.ensureChunk(this.x, this.z - 16),
      this.terrain.ensureChunk(this.x, this.z + 16),
      this.terrain.ensureChunk(this.x - 16, this.z - 16),
      this.terrain.ensureChunk(this.x - 16, this.z + 16),
      this.terrain.ensureChunk(this.x + 16, this.z - 16),
      this.terrain.ensureChunk(this.x + 16, this.z + 16),
    ]);
    // await this.generate();

    if (depth) {
      await Promise.all(chunks.map((chunk: Chunk) => chunk.generateWithSurrounding(depth - 1)));
      if (depth >= 2) {
        await this.generateObjects();
        await this.northChunk.generateObjects();
        await this.southChunk.generateObjects();
        await this.westChunk.generateObjects();
        await this.eastChunk.generateObjects();
        await this.northChunk.westChunk.generateObjects();
        await this.northChunk.eastChunk.generateObjects();
        await this.southChunk.westChunk.generateObjects();
        await this.southChunk.eastChunk.generateObjects();
      }
    }
    return this;
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

  setAtNoFlags(x: number, y: number, z: number, block: number): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    chunk.data[index] = block;
  }

  setAtNoFlagsAndRotate(
    x: number,
    y: number,
    z: number,
    block: number,
    {
      angle,
      dimensions: [width, height],
    }: { angle: 90 | 180 | 270; dimensions: readonly [number, number] },
  ): void {
    if (angle === 90) {
      const tmp = x;
      x = z;
      z = width - tmp - 1;
    }
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    chunk.data[index] = block;
  }

  setAtNoFlagsIfEmpty(x: number, y: number, z: number, block: number): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    if (chunk.data[index]) return;
    chunk.data[index] = block;
  }

  setAtWithFlags(x: number, y: number, z: number, block: number, flags: number): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    chunk.data[index] = block;
    chunk.flags[index] = flags;
  }

  setAtWithFlagsAndRotate(
    x: number,
    y: number,
    z: number,
    block: number,
    flags: number,
    {
      angle,
      dimensions: [width, height],
    }: { angle: 90 | 180 | 270; dimensions: readonly [number, number] },
  ): void {
    if (angle === 90) {
      const tmp = x;
      x = z;
      z = width - tmp - 1;
    }
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    chunk.data[index] = block;
    chunk.flags[index] = flags;
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

  generateAt(x: number, y: number, z: number, generateFn: () => number | [number, number]): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    const block = generateFn();
    if (typeof block === 'number') {
      chunk.data[index] = block;
    } else {
      const [data, flags] = block;
      chunk.data[index] = data;
      chunk.flags[index] = flags;
    }
  }

  generateAtNoFlags(x: number, y: number, z: number, generateFn: (block: number) => number): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    const block = generateFn(chunk.data[index]);
    chunk.data[index] = block;
  }

  generateAtIfEmpty(
    x: number,
    y: number,
    z: number,
    generateFn: () => number | [number, number],
  ): void {
    const chunk = getChunkNear(this, x, y, z);
    const index = (x & 0xf) | ((z & 0xf) << 4) | (y << 8);
    if (chunk.data[index]) return;
    const block = generateFn();
    if (typeof block === 'number') {
      chunk.data[index] = block;
    } else {
      const [data, flags] = block;
      chunk.data[index] = data;
      chunk.flags[index] = flags;
    }
  }

  at(x: number, y: number, z: number): number {
    return getChunkNear(this, x, y, z).data[(x & 0xf) | ((z & 0xf) << 4) | (y << 8)];
  }

  async generateObjects(): Promise<Chunk> {
    if (this.objectsGenerated) {
      return this;
    }
    await new Promise((resolve) => {
      generateObjects(this.chunkGenerator, this);
      resolve();
      profileChunkGenerationFoliage();
    });
    this.objectsGenerated = true;
    return this;
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
