// @flow
import type { ChunkState } from './chunkConstants';
import { CHUNK_STATUS_NEED_LOAD_ALL } from './chunkConstants';
import { getGeoId } from '../../../../common/chunk';
// north direction - decreasing of X

class ChunkBase<TChunk> {
  x: number;
  z: number;
  height: number;
  geoId: string;
  westChunk: TChunk = this;
  eastChunk: TChunk = this;
  southChunk: TChunk = this;
  northChunk: TChunk = this;
  state: ChunkState = CHUNK_STATUS_NEED_LOAD_ALL;
  nestedChunks: TChunk[] = [];
  hasNestedChunks: boolean = false;
  surroundingChunks: TChunk[] = [];
  hasSurroundingChunks: boolean = false;

  static BUFFERS_COUNT: number = 3;

  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
    this.geoId = getGeoId(x, z);
  }

  checkNestedChunks() {
    this.nestedChunks = [
      this.northChunk,
      this.westChunk,
      this.southChunk,
      this.eastChunk,
    ].filter(chunk => chunk !== this);
    this.hasNestedChunks = this.nestedChunks.length === 4;
    this.surroundingChunks = [
      this.northChunk.eastChunk,
      this.northChunk.westChunk,
      this.southChunk.eastChunk,
      this.southChunk.westChunk,
    ].filter(chunk => chunk !== this).concat(this.nestedChunks);
    this.hasSurroundingChunks = this.surroundingChunks.length === 8;
  }

  setNorthChunk(chunk: TChunk) {
    this.northChunk = chunk;
    this.checkNestedChunks();
  }

  setSouthChunk(chunk: TChunk) {
    this.southChunk = chunk;
    this.checkNestedChunks();
  }

  setWestChunk(chunk: TChunk) {
    this.westChunk = chunk;
    this.checkNestedChunks();
  }

  setEastChunk(chunk: TChunk) {
    this.eastChunk = chunk;
    this.checkNestedChunks();
  }
}

export const COLUMN: 1 = 1;
export const ROW: 16 = 16;
export const SLICE: 256 = 256;

export const COLUMN_NESTED_CHUNK: 15 = 15;
export const ROW_NESTED_CHUNK: 240 = 240;

export default ChunkBase;
