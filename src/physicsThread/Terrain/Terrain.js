// @flow strict
import Chunk from './Chunk/Chunk';
import { CHUNK_STATUS_LOADED } from '../../Terrain/Chunk/chunkConstants';


const terrainProvider = TerrainBase =>
  class Terrain extends TerrainBase {
    loadChunk = (x: number, z: number, data: ArrayBuffer) => {
      const chunk = this.addChunk(new Chunk(data, x, z));
      chunk.state = CHUNK_STATUS_LOADED;
    }
  };

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
