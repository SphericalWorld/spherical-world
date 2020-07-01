import type { Maybe } from '../../common/fp/monads/maybe';
import type ChunkBase from './Chunk/ChunkBase';
import { getGeoId } from '../../common/chunk';
import HashMap from '../../common/fp/data-structures/Map';

class Terrain<Chunk extends ChunkBase> {
  chunks: HashMap<string, Chunk> = new HashMap();

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
    return chunk;
  }

  getChunk(x: number, z: number): Maybe<Chunk> {
    return this.chunks.get(getGeoId(x, z));
  }
}

export default Terrain;
