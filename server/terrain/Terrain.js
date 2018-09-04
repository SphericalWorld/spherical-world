// @flow
import type { Block } from '../../common/block';

import Chunk from './Chunk';
import ChunkGenerator from './ChunkGenerator';
import { getGeoId } from '../../common/chunk';

type Position3D = {|
  x: number,
  y: number,
  z: number,
|};

export default class Terrain {
  locationName: string;
  chunkGenerator: ChunkGenerator;
  seed: number;
  chunks: Map<string, Chunk> = new Map();

  constructor(locationName: string, seed: number) {
    this.locationName = locationName;
    this.seed = seed;
    this.chunkGenerator = ChunkGenerator(this.seed);
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

  getChunk(x: number, z: number) {
    return this.chunks.get(getGeoId(x, z));
  }

  async ensureChunk(x: number, z: number): Promise<Chunk> {
    const existingChunk = this.chunks.get(getGeoId(x, z));
    if (existingChunk) {
      return existingChunk;
    }
    const newChunk = new Chunk(this, x, z);
    this.addChunk(newChunk);
    await newChunk.generate();
    return newChunk;
  }

  async sendChunk(player, x: number, z: number) {
    let chunk;
    if (true) {
      chunk = await this.ensureChunk(x, z);
      await chunk.generateWithSurrounding(2);
    } else {
      chunk = this.chunks.get(getGeoId(x, z));
      if (!chunk) {
        chunk = await this.ensureChunk(x, z);
        try {
          await chunk.load();
        } catch (e) {
          if (e.code !== 'ENOENT') {
            console.error('unable to read chunk data:');
            console.error(e.stack);
          }
          await chunk.generateWithSurrounding(2);
          await chunk.save();
        }
      }
    }
    chunk.qwe = true;

    const data = await chunk.getCompressedData();
    player.socket.sendSerialized(data);
    player.socket.postMessage('loadChunk', {
      x, z, rainfall: chunk.rainfall.data, temperature: chunk.temperature.data,
    });
  }

  putBlockHandler({
    geoId, x, y, z, blockId,
  }: {
    geoId: string,
    blockId: Block,
    ...Position3D
  }) {
    const chunk = this.chunks.get(geoId);
    if (!chunk) {
      return;
    }
    console.log(blockId);
    chunk.data[x + z * 16 + y * 256] = blockId;
    if (chunk.changesCount < 15) {
      chunk.changesCount += 1;
    } else {
      chunk.changesCount = 0;
      chunk.save();
    }
  }

  removeBlockHandler(params) {
    this.putBlockHandler({ ...params, blockId: 0 });
  }
}
