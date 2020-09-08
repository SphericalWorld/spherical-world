import { getIndex } from '../../../../common/chunk';
import {
  BLOCKS_IN_SUBCHUNK,
  CHUNK_WIDTH,
  CHUNK_HEIGHT,
  SLICE,
} from '../../../../common/constants/chunk';
import { blocksInfo } from '../../../blocks/blockInfo';
import ChunkBase from '../../../Terrain/Chunk/ChunkBase';

import {
  CHUNK_STATUS_LOADED,
  CHUNK_STATUS_NEED_LOAD_ALL,
  CHUNK_STATUS_NEED_LOAD_LIGHT,
  CHUNK_STATUS_NEED_LOAD_VBO,
} from '../../../Terrain/Chunk/chunkConstants';
import {
  calcRecursionRed,
  calcRecursionGreen,
  calcRecursionBlue,
  calcRecursionGlobal,
  calcRecursionRedRemove,
  calcRecursionGreenRemove,
  calcRecursionBlueRemove,
  calcRecursionGlobalRemove,
} from './chunkLigting';
import { GameEvent } from '../../../Events';

type VectorArray<T> = {
  data: T;
  index: number;
  push(...items: number[]): void;
};

type ChunkBuffers = {
  vertexBuffer: VectorArray<Float32Array>;
  indexBuffer: VectorArray<Uint16Array>;
  vertexCount: number;
};

const POOL_SIZE = 100000;
const vertexPool = new Float32Array(POOL_SIZE * 4 * 3);
const vertexPool2 = new Float32Array(POOL_SIZE * 4);
const vertexPool3 = new Float32Array(POOL_SIZE * 4);

const indexPool = new Uint16Array(POOL_SIZE * 3);
const indexPool2 = new Uint16Array(POOL_SIZE);
const indexPool3 = new Uint16Array(POOL_SIZE);

// don't move buffers to helper function, it will me polymorphic, not monomorphic and performance
// will drop significally
const createBuffers = (vertexBuffer: Float32Array, indexBuffer: Uint16Array): ChunkBuffers => ({
  vertexBuffer: {
    data: vertexBuffer,
    index: 0,
    push(...data) {
      for (let index = 0; index < data.length; index += 1) {
        this.data[this.index] = data[index];
        this.index += 1;
      }
    },
  },
  indexBuffer: {
    data: indexBuffer,
    index: 0,
    push(...data) {
      for (let index = 0; index < data.length; index += 1) {
        this.data[this.index] = data[index];
        this.index += 1;
      }
    },
  },
  vertexCount: 0,
});

export default class Chunk extends ChunkBase {
  minimap: Uint8Array = new Uint8Array(256 * 3);

  westChunk: Chunk = this;
  eastChunk: Chunk = this;
  southChunk: Chunk = this;
  northChunk: Chunk = this;
  surroundingChunks: Chunk[] = [];
  nestedChunks: Chunk[] = [];
  blocksInfo = blocksInfo;

  calcRecursionRed(x: number, y: number, z: number): void {
    calcRecursionRed(this, x, y, z, 400);
  }

  calcRecursionGreen(x: number, y: number, z: number): void {
    calcRecursionGreen(this, x, y, z, 400);
  }

  calcRecursionBlue(x: number, y: number, z: number): void {
    calcRecursionBlue(this, x, y, z, 400);
  }

  calcGlobalRecursion(x: number, y: number, z: number): void {
    calcRecursionGlobal(this, x, y, z, 400);
  }

  calcRecursionRedRemove(x: number, y: number, z: number): void {
    calcRecursionRedRemove(this, x, y, z, 400);
  }

  calcRecursionGreenRemove(x: number, y: number, z: number): void {
    calcRecursionGreenRemove(this, x, y, z, 400);
  }

  calcRecursionBlueRemove(x: number, y: number, z: number): void {
    calcRecursionBlueRemove(this, x, y, z, 400);
  }

  calcGlobalRecursionRemove(x: number, y: number, z: number): void {
    calcRecursionGlobalRemove(this, x, y, z, 400);
  }

  calcVBO(subchunkIndex = 0): void {
    const buffers = [
      createBuffers(vertexPool, indexPool),
      createBuffers(vertexPool2, indexPool2),
      createBuffers(vertexPool3, indexPool3),
    ];

    const iterateFrom = subchunkIndex === 0 ? SLICE : BLOCKS_IN_SUBCHUNK * subchunkIndex;
    const iterateTo = BLOCKS_IN_SUBCHUNK * (subchunkIndex + 1);

    for (let index = iterateFrom; index < iterateTo; index += 1) {
      const i = index >>> 8;
      const j = index & 0xf;
      const k = (index >>> 4) & 0xf;
      const block = this.blocks[index];
      if (block) {
        buffers[blocksInfo[block].buffer.top].vertexCount += blocksInfo[block].renderToChunk(
          this,
          j,
          i,
          k,
          buffers[blocksInfo[block].buffer.top],
        );
      }
    }

    const buffersInfo = [
      {
        indexCount: 0,
        index: 0,
        offset: 0,
      },
      {
        indexCount: 0,
        index: 1,
        offset: 0,
      },
      {
        indexCount: 0,
        index: 2,
        offset: 0,
      },
    ];
    let offset = buffers[0].indexBuffer.index;
    let offset2 = buffers[0].vertexBuffer.index;
    let offset3 = buffers[0].vertexCount;
    buffersInfo[0].indexCount = buffers[0].indexBuffer.index;

    for (let i = 1; i < buffers.length; i += 1) {
      const { indexBuffer, vertexBuffer } = buffers[i];
      buffersInfo[i].indexCount = indexBuffer.index;
      for (let index = 0; index < indexBuffer.index; index += 1) {
        indexPool[index + offset] = indexBuffer.data[index] + offset3;
      }
      for (let index = 0; index < vertexBuffer.index; index += 1) {
        vertexPool[index + offset2] = vertexBuffer.data[index];
      }
      buffersInfo[i].offset = buffersInfo[i - 1].offset + buffersInfo[i - 1].indexCount * 2;
      offset += indexBuffer.index;
      offset2 += vertexBuffer.index;
      offset3 += buffers[i].vertexCount;
    }

    const buffersData = {
      vertexBuffer: vertexPool.slice(0, offset2 + buffers[2].vertexBuffer.index).buffer,
      indexBuffer: indexPool.slice(0, offset + buffers[2].indexBuffer.index).buffer,
    };
    self.postMessage(
      {
        type: 'UPDATE_COMPONENTS',
        payload: {
          events: [
            {
              type: GameEvent.chunkVBOLoaded,
              payload: {
                geoId: this.geoId,
                subchunk: subchunkIndex,
                buffers: buffersData,
                hasData: offset2 + buffers[2].vertexBuffer.index !== 0,
                buffersInfo,
              },
            },
          ],
        },
      },
      Object.values(buffersData),
    );
  }

  prepareLight(): void {
    for (let x = 0; x < CHUNK_WIDTH; x += 1) {
      for (let z = 0; z < CHUNK_WIDTH; z += 1) {
        let y = CHUNK_HEIGHT - 1;
        let lightLevel = 15;
        while (y > 0) {
          const index = getIndex(x, y, z);
          if (!blocksInfo[this.blocks[index]].sightTransparent) {
            lightLevel = 0;
          } else if (!blocksInfo[this.blocks[index]].lightTransparent) {
            lightLevel -= 1;
          }
          if (!lightLevel) {
            break;
          }
          this.light[index] = lightLevel;
          y -= 1;
        }
        // const index = getIndex(x, y, z);

        // this.minimap[(x + z * 16) * 3] = this.terrainMipMap[blocksTextureInfo[this.blocks[index]][0]][0];
        // this.minimap[(x + z * 16) * 3 + 1] = this.terrainMipMap[blocksTextureInfo[this.blocks[index]][0]][1];
        // this.minimap[(x + z * 16) * 3 + 2] = this.terrainMipMap[blocksTextureInfo[this.blocks[index]][0]][2];
      }
    }
  }

  calcGlobalLight(): void {
    for (let x = 0; x < CHUNK_WIDTH; x += 1) {
      for (let z = 0; z < CHUNK_WIDTH; z += 1) {
        let y = CHUNK_HEIGHT - 1;
        while (y > 0 && blocksInfo[this.blocks[getIndex(x, y, z)]].sightTransparent) {
          y -= 1;
          this.calcGlobalRecursion(x, y + 1, z);
        }
      }
    }
    for (let x = 0; x < CHUNK_WIDTH; x += 1) {
      for (let z = 0; z < CHUNK_WIDTH; z += 1) {
        let y = CHUNK_HEIGHT - 1;
        while (y > 0) {
          const index = getIndex(x, y, z);
          if (this.blocks[index] === 128) {
            this.light[index] = (this.light[index] & 0x000f) | 0xfd20;
            this.calcRecursionRed(x, y, z);
            this.calcRecursionGreen(x, y, z);
            this.calcRecursionBlue(x, y, z);
          }

          y -= 1;
        }
      }
    }
  }

  putBlock(x: number, y: number, z: number, value: number, flags: number): void {
    const index = getIndex(x, y, z);
    let placed = true;
    if (blocksInfo[value]) {
      placed = blocksInfo[value].putBlock(this, x, y, z, value, flags);
    } else {
      this.blocks[index] = value;
    }
    if (!placed) {
      return;
    }
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
    if (blocksInfo[this.blocks[getIndex(x, y, z)]].lightTransparent) {
      return;
    }
    while (y > -1 && !this.blocks[index]) {
      this.calcGlobalRecursionRemove(x, y, z);
      y -= 1;
    }
    this.calcGlobalRecursion(x, y, z);
  }

  removeBlock(x: number, y: number, z: number): void {
    const index = getIndex(x, y, z);
    const block = this.blocks[index];
    this.blocks[index] = 0;
    const ytmp = y;
    if ((this.light[index + SLICE] & 0xf) === 15) {
      const ytmp2 = y;
      while (y > -1 && !this.blocks[index]) {
        this.light[index] = (this.light[index] & 0xfff0) | 0x000f;
        y -= 1;
      }
      y = ytmp2;
      while (y > -1 && !this.blocks[index]) {
        this.calcGlobalRecursion(x, y, z);
        y -= 1;
      }
    } else {
      // TODO - copy from addblock
      this.calcGlobalRecursion(x, y, z);
    }
    y = ytmp;
    if (blocksInfo[block].lightTransparent) {
      this.calcRecursionRedRemove(x, y, z);
      this.calcRecursionGreenRemove(x, y, z);
      this.calcRecursionBlueRemove(x, y, z);
    } else {
      this.calcRecursionRed(x, y, z);
      this.calcRecursionGreen(x, y, z);
      this.calcRecursionBlue(x, y, z);
    }
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
  }

  updateState(): void {
    const updateState = (chunk: Chunk) =>
      chunk.state !== CHUNK_STATUS_NEED_LOAD_ALL ? chunk.updateState() : null;
    if (this.state === CHUNK_STATUS_NEED_LOAD_ALL) {
      this.state = CHUNK_STATUS_NEED_LOAD_LIGHT;
      this.surroundingChunks.forEach(updateState);
      this.updateState();
    } else if (this.state === CHUNK_STATUS_NEED_LOAD_LIGHT) {
      if (
        this.hasSurroundingChunks &&
        this.surroundingChunks.every((chunk) => chunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)
      ) {
        this.state = CHUNK_STATUS_NEED_LOAD_VBO;
        this.calcGlobalLight();
        this.nestedChunks.forEach(updateState);
        this.updateState();
      }
    } else if (this.state === CHUNK_STATUS_NEED_LOAD_VBO) {
      if (
        this.hasNestedChunks &&
        this.nestedChunks.every((chunk) => chunk.state >= CHUNK_STATUS_NEED_LOAD_VBO)
      ) {
        for (let index = 0; index < 16; index += 1) {
          this.calcVBO(index);
        }
        this.state = CHUNK_STATUS_LOADED;
        this.nestedChunks.forEach(updateState);
      }
    }
  }
}
