import type { ChunkState } from './chunkConstants';
import { BLOCKS_IN_CHUNK } from '../../../common/constants/chunk';
import { CHUNK_STATUS_NEED_LOAD_ALL, CHUNK_STATUS_NEED_LOAD_VBO } from './chunkConstants';
import { getGeoId, getIndex } from '../../../common/chunk';
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
  hasNestedChunks = false;
  surroundingChunks: TChunk[] = [];
  hasSurroundingChunks = false;
  blocks: Uint8Array;
  light: Uint16Array;
  flags: Uint8Array;

  static BUFFERS_COUNT = 3;

  constructor(blocksData: ArrayBuffer, lightData: ArrayBuffer, x: number, z: number) {
    this.x = x;
    this.z = z;
    this.geoId = getGeoId(x, z);
    this.blocks = new Uint8Array(blocksData, 0, BLOCKS_IN_CHUNK);
    this.light = new Uint16Array(lightData, 0, BLOCKS_IN_CHUNK);
    this.flags = new Uint8Array(blocksData, BLOCKS_IN_CHUNK);
  }

  getBlock(x: number, y: number, z: number): number {
    return this.blocks[getIndex(x, y, z)];
  }

  setBlock(x: number, y: number, z: number, value: number): void {
    this.blocks[getIndex(x, y, z)] = value;
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
  }

  checkNestedChunks() {
    this.nestedChunks = [this.northChunk, this.westChunk, this.southChunk, this.eastChunk].filter(
      (chunk) => chunk !== this,
    );
    this.hasNestedChunks = this.nestedChunks.length === 4;
    this.surroundingChunks = [
      this.northChunk.eastChunk,
      this.northChunk.westChunk,
      this.southChunk.eastChunk,
      this.southChunk.westChunk,
    ]
      .filter((chunk) => chunk !== this)
      .concat(this.nestedChunks);
    this.hasSurroundingChunks = this.surroundingChunks.length === 8;
  }

  setNorthChunk(chunk: TChunk): void {
    this.northChunk = chunk;
    this.checkNestedChunks();
  }

  setSouthChunk(chunk: TChunk): void {
    this.southChunk = chunk;
    this.checkNestedChunks();
  }

  setWestChunk(chunk: TChunk): void {
    this.westChunk = chunk;
    this.checkNestedChunks();
  }

  setEastChunk(chunk: TChunk): void {
    this.eastChunk = chunk;
    this.checkNestedChunks();
  }
}

export default ChunkBase;
