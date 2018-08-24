// @flow
import ChunkBase from './ChunkBase';

export default class ChunkWithData<TChunk> extends ChunkBase<TChunk> {
  blocks: Uint8Array;
  light: Uint16Array;
}
