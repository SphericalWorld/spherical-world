// @flow
import type { ChunkState } from './chunkConstants';
import { CHUNK_STATUS_NEED_LOAD_ALL } from './chunkConstants';
// north direction - decreasing of X

class ChunkBase<TChunk, TTerrain> {
  x: number;
  z: number;
  height: number;
  geoId: string;
  westChunk: TChunk = this;
  eastChunk: TChunk = this;
  southChunk: TChunk = this;
  northChunk: TChunk = this;
  state: ChunkState = CHUNK_STATUS_NEED_LOAD_ALL;
  terrain: TTerrain;
  haveNestedChunks: boolean = false;
  haveSurroundingChunks: boolean = false;

  static BUFFERS_COUNT: number = 3;

  constructor(terrain: TTerrain, x: number, z: number) {
    this.x = x;
    this.z = z;
    this.height = 256;
    this.geoId = ChunkBase.getGeoId(x, z);
    this.terrain = terrain;
  }

  static getGeoId(x: number, z: number) {
    return `${x | 0}_${z | 0}`;
  }

  checkNestedChunks() {
    this.haveNestedChunks = this !== this.northChunk
      && this !== this.westChunk
      && this !== this.southChunk
      && this !== this.eastChunk;
    this.haveSurroundingChunks = this.haveNestedChunks
      && this !== this.northChunk.eastChunk
      && this !== this.northChunk.westChunk
      && this !== this.southChunk.eastChunk
      && this !== this.southChunk.westChunk;
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

export const getGeoId = (x: number, z: number): string => `${x | 0}_${z | 0}`;

export const COLUMN: 1 = 1;
export const ROW: 16 = 16;
export const SLICE: 256 = 256;

export const COLUMN_NESTED_CHUNK: 15 = 15;
export const ROW_NESTED_CHUNK: 240 = 240;

export const getIndex = (x: number, y: number, z: number) => x + (z << 4) + (y << 8);

/* ::
export const TChunkBase = new ChunkBase(0, 0);
*/

export default ChunkBase;
