import { vec3 } from 'gl-matrix';
import type { Block } from '../../common/block';
import type { CreateItem } from '../item';
import Chunk from './Chunk';
import { getGeoId } from '../../common/chunk';
import { send } from '../network/socket';
import type { ChunkGeneratorThread } from '../threads';
import ChunkMap from './ChunkMap';

type Position3D = {
  x: number;
  y: number;
  z: number;
};

const createTerrain = (createItem: CreateItem, chunkGeneratorThread: ChunkGeneratorThread) =>
  class Terrain {
    locationName: string;
    seed: number;
    chunks: Map<string, Chunk> = new Map();

    constructor(locationName: string, seed: number) {
      this.locationName = locationName;
      this.seed = seed;
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
      const chunkData = await chunkGeneratorThread.ensureChunk(x, z);
      newChunk.setData(chunkData.dataBuffer, chunkData.flagsBuffer);
      newChunk.setRainfall(new ChunkMap(chunkData.rainfall));
      newChunk.setTemperature(new ChunkMap(chunkData.temperature));

      // await newChunk.generate();
      return newChunk;
    }

    async sendChunk(player, x: number, z: number) {
      let chunk;
      if (true) {
        chunk = await this.ensureChunk(x, z);
        // await chunk.generateWithSurrounding(2);
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
      send(player.socket, 'loadChunk', {
        x,
        z,
        rainfall: chunk.rainfall.data,
        temperature: chunk.temperature.data,
      });
    }

    putBlockHandler({
      geoId,
      positionInChunk: [x, y, z],
      blockId,
      flags,
    }: {
      geoId: string;
      blockId: Block;
      flags: number;
      positionInChunk: vec3;
    }) {
      const chunk = this.chunks.get(geoId);
      if (!chunk) {
        return;
      }
      chunk.data[x + z * 16 + y * 256] = blockId;
      chunk.flags[x + z * 16 + y * 256] = flags;
      if (chunk.changesCount < 15) {
        chunk.changesCount += 1;
      } else {
        chunk.changesCount = 0;
        chunk.save();
      }
    }

    removeBlockHandler({
      geoId,
      positionInChunk: [x, y, z],
      position,
    }: SpreadTypes<
      {
        geoId: string;
        positionInChunk: vec3;
        position: vec3;
      },
      Position3D
    >) {
      const chunk = this.chunks.get(geoId);
      if (!chunk || !chunk.data[x + z * 16 + y * 256]) {
        return;
      }
      const blockType = chunk.data[x + z * 16 + y * 256];
      chunk.data[x + z * 16 + y * 256] = 0;
      chunk.flags[x + z * 16 + y * 256] = 0;
      if (chunk.changesCount < 15) {
        chunk.changesCount += 1;
      } else {
        chunk.changesCount = 0;
        chunk.save();
      }
      return createItem(null, vec3.add(position, position, vec3.fromValues(0.5, 0.7, 0.5)), {
        itemTypeId: blockType,
        count: 1,
        name: 'block',
        id: 'slot',
      });
    }
  };

export type Terrain = InstanceType<ReturnType<typeof createTerrain>>;

export default createTerrain;
