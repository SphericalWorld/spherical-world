// @flow
import Chunk from './Chunk/Chunk';
import { CHUNK_STATUS_LOADED } from '../../Terrain/Chunk/chunkConstants';


const terrainProvider = TerrainBase =>
  class Terrain extends TerrainBase {
    constructor() {
      super();
      this.size = 16;
      this.halfSize = 8;
    }

    loadChunk = (x: number, z: number, data: ArrayBuffer) => {
      const chunk = this.addChunk(new Chunk(this, x, z));
      chunk.blocksData = data;
      chunk.blocks = new Uint8Array(chunk.blocksData);
      chunk.state = CHUNK_STATUS_LOADED;
    }
  };

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
