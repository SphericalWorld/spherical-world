// @flow
import { connect } from '../../util';

import { CHUNK_STATUS_LOADED } from '../../Terrain/Chunk/chunkConstants';

const mapState = (state) => {
  const chunksData = state.chunks.instances;
  // const {
  //   x: playerX, z: playerZ,
  // } = (state.players.instances[state.players.mainPlayerId] || {});
  return {
    chunksData,
  };
};

const terrainProvider = (store, Chunk, TerrainBase) => {
  class Terrain extends TerrainBase {
    playerX: number;
    playerZ: number;

    constructor() {
      super();
      this.size = 16;
      this.halfSize = 8;
    }

    componentDidUpdate(prevState: Terrain) {
      // const chunkXold = Math.floor(prevState.playerX / 16) * 16;
      // const chunkZold = Math.floor(prevState.playerZ / 16) * 16;
      //
      // const chunkX = Math.floor(this.playerX / 16) * 16;
      // const chunkZ = Math.floor(this.playerZ / 16) * 16;
      // if (chunkX !== chunkXold || chunkZ !== chunkZold) {
      //   this.chunks = new Map([...this.chunks.entries()].filter(([key, value]) => {
      //     return (value.x > chunkX - (this.halfSize * 16))
      //       && (value.x < chunkX + (this.halfSize * 16))
      //       && (value.z > chunkZ - (this.halfSize * 16))
      //       && (value.z < chunkZ + (this.halfSize * 16));
      //   }));
      //   // this.filterFarChunks();
      // }
      // TODO: create helper
      if (Object.keys(prevState.chunksData).length !== Object.keys(this.chunksData).length) {
        for (const key of Object.keys(this.chunksData)) {
          if (typeof prevState.chunksData[key] === 'undefined') {
            const chunkData = this.chunksData[key];
            const chunk = this.addChunk(new Chunk(this, chunkData.x, chunkData.z));
            chunk.blocksData = chunkData.data;
            chunk.blocks = new Uint8Array(chunk.blocksData);
            chunk.state = CHUNK_STATUS_LOADED;
            break;
          }
        }
      }
    }
  }
  return connect(mapState, null, store)(Terrain);
};

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
