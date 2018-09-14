// @flow
import { getIndex } from '../../../common/chunk';
import { BLOCKS_IN_CHUNK } from '../../../common/constants/chunk';
import ChunkBase from './ChunkBase';
import { CHUNK_STATUS_NEED_LOAD_VBO } from './chunkConstants';

export default class ChunkWithData<TChunk> extends ChunkBase<TChunk> {
  blocks: Uint8Array;
  light: Uint16Array = new Uint16Array(BLOCKS_IN_CHUNK);
  flags: Uint8Array;

  getBlock(x: number, y: number, z: number) {
    return this.blocks[getIndex(x, y, z)];
  }

  setBlock(x: number, y: number, z: number, value: number) {
    this.blocks[getIndex(x, y, z)] = value;
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
  }
}
