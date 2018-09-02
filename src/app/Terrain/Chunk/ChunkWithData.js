// @flow
import { getIndex } from '../../../../common/chunk';
import ChunkBase from './ChunkBase';
import { CHUNK_STATUS_NEED_LOAD_VBO } from './chunkConstants';

export default class ChunkWithData<TChunk> extends ChunkBase<TChunk> {
  blocks: Uint8Array;
  light: Uint16Array = new Uint16Array(this.height * 16 * 16);
  flags: Uint8Array = new Uint8Array(this.height * 16 * 16);

  getBlock(x: number, y: number, z: number) {
    return this.blocks[getIndex(x, y, z)];
  }

  setBlock(x: number, y: number, z: number, value: number) {
    this.blocks[getIndex(x, y, z)] = value;
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
  }
}
