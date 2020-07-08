import type { ChunkGenerator } from './ChunkGenerator';
import createChunkGenerator from './ChunkGenerator';
import { Chunk } from './Chunk';
import { getGeoId } from '../../../common/chunk';

export class Terrain {
  locationName: string;
  chunkGenerator: ChunkGenerator;
  seed: number;
  chunks: Map<string, Chunk> = new Map();

  constructor(locationName: string, seed: number) {
    this.locationName = locationName;
    this.seed = seed;
    this.chunkGenerator = createChunkGenerator(this.seed);
  }

  addChunk(chunk: Chunk): void {
    this.chunks.set(chunk.geoId, chunk);
    const northChunk = this.chunks.get(getGeoId(chunk.x - 16, chunk.z));
    const southChunk = this.chunks.get(getGeoId(chunk.x + 16, chunk.z));
    const westChunk = this.chunks.get(getGeoId(chunk.x, chunk.z - 16));
    const eastChunk = this.chunks.get(getGeoId(chunk.x, chunk.z + 16));
    if (northChunk) {
      chunk.northChunk = northChunk;
      northChunk.southChunk = chunk;
    }
    if (southChunk) {
      chunk.southChunk = southChunk;
      southChunk.northChunk = chunk;
    }
    if (westChunk) {
      chunk.westChunk = westChunk;
      westChunk.eastChunk = chunk;
    }
    if (eastChunk) {
      chunk.eastChunk = eastChunk;
      eastChunk.westChunk = chunk;
    }
  }

  getChunk(x: number, z: number): Chunk | undefined {
    return this.chunks.get(getGeoId(x, z));
  }

  async ensureChunk(x: number, z: number): Promise<Chunk> {
    const existingChunk = this.getChunk(x, z);
    if (existingChunk) {
      return existingChunk;
    }
    const newChunk = new Chunk(this, x, z);
    this.addChunk(newChunk);
    await newChunk.generate();
    // await newChunk.generateWithSurrounding(2);
    return newChunk;
  }

  async generateChunk(
    x: number,
    z: number,
  ): Promise<{
    dataBuffer: SharedArrayBuffer;
    flags: Buffer;
    rainfall: number[];
    temperature: number[];
  }> {
    const newChunk = await this.ensureChunk(x, z);
    await newChunk.generateWithSurrounding(2);
    return {
      dataBuffer: newChunk.dataBuffer,
      flags: newChunk.flags,
      temperature: newChunk.temperature.data,
      rainfall: newChunk.rainfall.data,
    };
  }
}
