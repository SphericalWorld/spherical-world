// @flow
import type { Maybe } from '../../../common/fp/monads/maybe';
import type TChunkBase from './Chunk/ChunkBase';
import { getGeoId } from '../../../common/chunk';
import HashMap from '../../../common/fp/data-structures/Map';

const terrainBaseProvider = (Chunk: TChunkBase) => {
  class Terrain {
    chunks: HashMap<string, Chunk> = new HashMap();
    size: number;
    halfSize: number;
    playerX: number;
    playerZ: number;

    constructor() {
      this.size = 16;
      this.halfSize = 8;
    }

    addChunk(chunk: Chunk): Chunk {
      this.chunks.set(chunk.geoId, chunk);
      this.chunks.get(getGeoId(chunk.x - 16, chunk.z)).map((northChunk) => {
        chunk.setNorthChunk(northChunk);
        northChunk.setSouthChunk(chunk);
      });
      this.chunks.get(getGeoId(chunk.x + 16, chunk.z)).map((southChunk) => {
        chunk.setSouthChunk(southChunk);
        southChunk.setNorthChunk(chunk);
      });
      this.chunks.get(getGeoId(chunk.x, chunk.z - 16)).map((westChunk) => {
        chunk.setWestChunk(westChunk);
        westChunk.setEastChunk(chunk);
      });
      this.chunks.get(getGeoId(chunk.x, chunk.z + 16)).map((eastChunk) => {
        chunk.setEastChunk(eastChunk);
        eastChunk.setWestChunk(chunk);
      });

      if (this.terrainMipMap) {
        chunk.terrainMipMap = this.terrainMipMap;
      }

      return chunk;
    }

    getChunk(x: number, z: number): Maybe<Chunk> {
      return this.chunks.get(getGeoId(x, z));
    }
  }

  return Terrain;
};

/* ::
export const ITerrainBase = terrainBaseProvider();
*/

export default terrainBaseProvider;
