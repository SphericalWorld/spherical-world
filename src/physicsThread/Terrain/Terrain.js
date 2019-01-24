// @flow strict
import Chunk from './Chunk/Chunk';
import { CHUNK_STATUS_LOADED } from '../../Terrain/Chunk/chunkConstants';
import TerrainBase from '../../Terrain/TerrainBase';

class Terrain extends TerrainBase<Chunk> {
  loadChunk = (x: number, z: number, data: ArrayBuffer, lightData: ArrayBuffer) => {
    const chunk = this.addChunk(new Chunk(data, lightData, x, z));
    chunk.state = CHUNK_STATUS_LOADED;
  }
}

export default Terrain;
