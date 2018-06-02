// @flow
import type { Terrain } from '../Terrain';
import { getIndex } from '../../../Terrain/Chunk/ChunkBase';
import { connect } from '../../../util';
import ChunkWithData from '../../../Terrain/Chunk/ChunkWithData';
import {
  blocksFlags,
  bufferInfo,
  blocksInfo,
} from '../../../blocks/blockInfo';

import {
  CHUNK_STATUS_NEED_LOAD_VBO,
} from '../../../Terrain/Chunk/chunkConstants';

const mapState = (state, chunk) => {
  if (!state.chunks.instances[chunk.geoId]) {
    return {};
  }
  return ({
    buffers: state.chunks.instances[chunk.geoId].buffers,
  });
};

const chunkProvider = (store) => {
  class Chunk extends ChunkWithData<Chunk, Terrain> {
    flags: Uint8Array;

    constructor(terrain: Terrain, x: number, z: number) {
      super(terrain, x, z);

      this.rainfallDataBuffer = new ArrayBuffer(256);
      this.rainfallData = new Uint8Array(this.rainfallDataBuffer);
      this.temperatureDataBuffer = new ArrayBuffer(256);
      this.temperatureData = new Uint8Array(this.temperatureDataBuffer);

      this.blocksFlags = blocksFlags;
      this.bufferInfo = bufferInfo;
      this.blocksInfo = blocksInfo;

      this.blocksData = new ArrayBuffer(this.height * 16 * 16);
      this.blocks = new Uint8Array(this.blocksData);
      this.lightData = new ArrayBuffer(this.height * 16 * 16 * 2);
      this.light = new Uint16Array(this.lightData);
    }

    getBlock(x, y, z) {
      return this.blocks[getIndex(x, y, z)];
    }

    setBlock(x, y, z, value) {
      this.blocks[x + z * 16 + y * 256] = value;
      this.state = CHUNK_STATUS_NEED_LOAD_VBO;
    }

    putBlock(x: number, y: number, z: number, value: number, plane: number) {
      let placed = true;
      if (this.blocksInfo[value][2]) {
        placed = this.blocksInfo[value][2].putBlock(this, x, y, z, value, plane);
      } else {
        this.blocks[x + z * 16 + y * 256] = value;
      }
      if (placed) {
        this.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
    }

    removeBlock(x: number, y: number, z: number): void {
      const index = getIndex(x, y, z);
      this.blocks[index] = 0;
      this.state = CHUNK_STATUS_NEED_LOAD_VBO;
    }
  }

  return connect(mapState, null, store)(Chunk);
};

/* ::
export const Chunk = chunkProvider();
*/

export default chunkProvider;
