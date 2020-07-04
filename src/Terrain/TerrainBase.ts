import type ChunkBase from './Chunk/ChunkBase';
import { getGeoId } from '../../common/chunk';

class Terrain<Chunk extends ChunkBase> {
  chunks: Map<string, Chunk> = new Map();

  addChunk(chunk: Chunk): Chunk {
    this.chunks.set(chunk.geoId, chunk);
    const northChunk = this.chunks.get(getGeoId(chunk.x - 16, chunk.z));
    if (northChunk) {
      chunk.setNorthChunk(northChunk);
      northChunk.setSouthChunk(chunk);
    }
    const southChunk = this.chunks.get(getGeoId(chunk.x + 16, chunk.z));
    if (southChunk) {
      chunk.setSouthChunk(southChunk);
      southChunk.setNorthChunk(chunk);
    }
    const westChunk = this.chunks.get(getGeoId(chunk.x, chunk.z - 16));
    if (westChunk) {
      chunk.setWestChunk(westChunk);
      westChunk.setEastChunk(chunk);
    }
    const eastChunk = this.chunks.get(getGeoId(chunk.x, chunk.z + 16));
    if (eastChunk) {
      chunk.setEastChunk(eastChunk);
      eastChunk.setWestChunk(chunk);
    }
    return chunk;
  }

  getChunk(x: number, z: number): Chunk | void {
    return this.chunks.get(getGeoId(x, z));
  }
}

export default Terrain;
