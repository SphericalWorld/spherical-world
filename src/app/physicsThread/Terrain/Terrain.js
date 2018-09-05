// @flow
import { BLOCKS_IN_CHUNK } from '../../../../common/constants/chunk';
import Chunk from './Chunk/Chunk';
import { CHUNK_STATUS_LOADED } from '../../Terrain/Chunk/chunkConstants';


const terrainProvider = TerrainBase =>
  class Terrain extends TerrainBase {
    loadChunk = (x: number, z: number, data: ArrayBuffer) => {
      const chunk = this.addChunk(new Chunk(x, z));
      chunk.blocksData = data;
      chunk.blocks = new Uint8Array(chunk.blocksData.slice(0, BLOCKS_IN_CHUNK));
      chunk.flags = new Uint8Array(chunk.blocksData.slice(BLOCKS_IN_CHUNK, BLOCKS_IN_CHUNK + BLOCKS_IN_CHUNK));
      chunk.state = CHUNK_STATUS_LOADED;
    }
  };

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
