// @flow
import { getIndex } from '../../../../common/chunk';
import ChunkBase from './ChunkBase';

export default class ChunkWithData<TChunk> extends ChunkBase<TChunk> {
  blocks: Uint8Array;
  light: Uint16Array;

  getBlock(x: number, y: number, z: number) {
    return this.blocks[getIndex(x, y, z)];
  }
}
