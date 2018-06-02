// @flow
import type { TChunkBase } from './Chunk/ChunkBase';

const terrainBaseProvider = (Chunk: TChunkBase) => {
  class Terrain {
    chunks: Map<string, Chunk> = new Map();
    size: number;
    halfSize: number;
    playerX: number;
    playerZ: number;

    constructor() {
      this.size = 16;
      this.halfSize = 8;
    }

    addChunk(chunk: Chunk) {
      this.chunks.set(chunk.geoId, chunk);
      const northChunk = this.chunks.get(Chunk.getGeoId(chunk.x - 16, chunk.z));
      const southChunk = this.chunks.get(Chunk.getGeoId(chunk.x + 16, chunk.z));
      const westChunk = this.chunks.get(Chunk.getGeoId(chunk.x, chunk.z - 16));
      const eastChunk = this.chunks.get(Chunk.getGeoId(chunk.x, chunk.z + 16));
      if (northChunk) {
        chunk.setNorthChunk(northChunk);
        northChunk.setSouthChunk(chunk);
      }
      if (southChunk) {
        chunk.setSouthChunk(southChunk);
        southChunk.setNorthChunk(chunk);
      }
      if (westChunk) {
        chunk.setWestChunk(westChunk);
        westChunk.setEastChunk(chunk);
      }
      if (eastChunk) {
        chunk.setEastChunk(eastChunk);
        eastChunk.setWestChunk(chunk);
      }
      if (this.terrainMipMap) {
        chunk.terrainMipMap = this.terrainMipMap;
      }

      return chunk;
    }

    getChunk(x: number, z: number) {
      return this.chunks.get(Chunk.getGeoId(x, z));
    }
  }

  return Terrain;
};

/* ::
export const ITerrainBase = terrainBaseProvider();
*/

export default terrainBaseProvider;
