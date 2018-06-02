// @flow

import ChunkBase from './ChunkBase';

export default class ChunkWithData<TChunk, TTerrain> extends ChunkBase<TChunk, TTerrain> {
  blocks: Uint8Array;
  lightData: ArrayBuffer;
  light: Uint16Array;
}
