// @flow
import type { Terrain } from '../Terrain';
import {
  blocksTextureInfo,
  blocksFlags,
  bufferInfo,
  blocksInfo,
  HAS_GRAPHICS_MODEL,
  LIGHT_TRANSPARENT,
  SIGHT_TRANSPARENT,
} from '../../../blocks/blockInfo';
import { connect } from '../../../util';
import ChunkWithData from '../../../Terrain/Chunk/ChunkWithData';
import {
  getIndex,
  COLUMN,
  ROW,
  SLICE,
  ROW_NESTED_CHUNK,
  COLUMN_NESTED_CHUNK,
} from '../../../Terrain/Chunk/ChunkBase';

import {
  CHUNK_STATUS_LOADED,
  CHUNK_STATUS_NEED_LOAD_ALL,
  CHUNK_STATUS_NEED_LOAD_LIGHT,
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

const getLightColor = (light, c, cf, s1, s1f, s2, s2f) => {
  const count = 1 + s1f + s2f + cf;
  const halfCount = 17 - (count / 2);
  return [
    0.8 ** (halfCount - ((((light >>> 12) & 0xF) + (s1f ? ((s1 >>> 12) & 0xF) : 0) + (s2f ? ((s2 >>> 12) & 0xF) : 0) + (cf ? ((c >>> 12) & 0xF) : 0)) / count)),
    0.8 ** (halfCount - ((((light >>> 8) & 0xF) + (s1f ? ((s1 >>> 8) & 0xF) : 0) + (s2f ? ((s2 >>> 8) & 0xF) : 0) + (cf ? ((c >>> 8) & 0xF) : 0)) / count)),
    0.8 ** (halfCount - ((((light >>> 4) & 0xF) + (s1f ? ((s1 >>> 4) & 0xF) : 0) + (s2f ? ((s2 >>> 4) & 0xF) : 0) + (cf ? ((c >>> 4) & 0xF) : 0)) / count)),
    0.8 ** (halfCount - (((light & 0xF) + (s1f ? (s1 & 0xF) : 0) + (s2f ? (s2 & 0xF) : 0) + (cf ? (c & 0xF) : 0)) / count)),
  ];
};

const getChunkNear = (j: number, k: number, chunk) => {
  let chunkNear = chunk;
  if (j === -1) {
    j = 15;
    chunkNear = chunkNear.northChunk;
  } else if (j === 16) {
    j = 0;
    chunkNear = chunkNear.southChunk;
  }
  if (k === -1) {
    k = 15;
    chunkNear = chunkNear.westChunk;
  } else if (k === 16) {
    k = 0;
    chunkNear = chunkNear.eastChunk;
  }
  return { j, k, chunkNear };
};

const getLight = (i: number, j: number, k: number, chunk) => {
  let chunkNear;
  ({ j, k, chunkNear } = getChunkNear(j, k, chunk));
  const index = getIndex(j, i, k);
  if (chunk.blocksFlags[chunkNear.blocks[index]][LIGHT_TRANSPARENT] || chunk.blocksFlags[chunkNear.blocks[index]][4]) {
    return [1, chunkNear.light[index]];
  }
  return [0, -1];
};

const calcRecursion = (
  mask: number,
  reversedMask: number,
  dec: number,
  type: number, // TODO boolean?
) => {
  const calcCurrent = (
    chunk,
    x: number,
    y: number,
    z: number,
    index,
  ): number => (chunk.light[index] & reversedMask) | (Math.max(
    (type ? 0 : (chunk.light[index] & mask)) + dec,
    ((z < 15) ? (chunk.light[index + ROW]) : (chunk.eastChunk.light[index - ROW_NESTED_CHUNK])) & mask,
    ((z > 0) ? (chunk.light[index - ROW]) : (chunk.westChunk.light[index + ROW_NESTED_CHUNK])) & mask,
    ((x < 15) ? (chunk.light[index + COLUMN]) : (chunk.southChunk.light[index - COLUMN_NESTED_CHUNK])) & mask,
    ((x > 0) ? (chunk.light[index - COLUMN]) : (chunk.northChunk.light[index + COLUMN_NESTED_CHUNK])) & mask,
    chunk.light[index + SLICE] & mask,
    chunk.light[index - SLICE] & mask,
  ) - dec);

  const updateIfLight = (
    index,
    lightTmp,
    chunk,
    ...params
  ) => {
    if (lightTmp > (chunk.light[index] & mask)) {
      calcRecursionInternal(chunk, ...params);
    }
  };

  const calcNear = (
    chunk,
    x: number,
    y: number,
    z: number,
    limit: number,
    index,
    lightTmp,
  ) => {
    if (z < 15) {
      updateIfLight(index + ROW, lightTmp, chunk, x, y, z + 1, limit);
    } else {
      updateIfLight(index - ROW_NESTED_CHUNK, lightTmp, chunk.eastChunk, x, y, 0, limit);
    }

    if (z > 0) {
      updateIfLight(index - ROW, lightTmp, chunk, x, y, z - 1, limit);
    } else {
      updateIfLight(index + ROW_NESTED_CHUNK, lightTmp, chunk.westChunk, x, y, 15, limit);
    }

    if (x < 15) {
      updateIfLight(index + COLUMN, lightTmp, chunk, x + 1, y, z, limit);
    } else {
      updateIfLight(index - COLUMN_NESTED_CHUNK, lightTmp, chunk.southChunk, 0, y, z, limit);
    }

    if (x > 0) {
      updateIfLight(index - COLUMN, lightTmp, chunk, x - 1, y, z, limit);
    } else {
      updateIfLight(index + COLUMN_NESTED_CHUNK, lightTmp, chunk.northChunk, 15, y, z, limit);
    }

    if (y < 255) {
      updateIfLight(index + SLICE, lightTmp, chunk, x, y + 1, z, limit);
    }

    if (y > 0) {
      updateIfLight(index - SLICE, lightTmp, chunk, x, y - 1, z, limit);
    }
  };

  const calcRecursionInternal = (
    chunk,
    x: number,
    y: number,
    z: number,
    limit: number,
  ) => {
    if (!limit) {
      return;
    }
    const index = getIndex(x, y, z);

    if (type) {
      const lightTmp = (chunk.light[index] & mask);
      if (chunk.blocks[index] && !chunk.blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]) {
        chunk.light[index] &= reversedMask;
      } else {
        chunk.light[index] = calcCurrent(chunk, x, y, z, index);
        if (chunk.state === CHUNK_STATUS_LOADED) {
          chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
        }
      }
      if (((chunk.light[index] & mask)) !== lightTmp) {
        calcNear(chunk, x, y, z, limit - 1, index, lightTmp);
      }
    } else if (chunk.blocks[index] && !chunk.blocksFlags[chunk.blocks[index]][SIGHT_TRANSPARENT]) {
      chunk.light[index] &= reversedMask;
    } else {
      chunk.light[index] = calcCurrent(chunk, x, y, z, index);
      if (chunk.state === CHUNK_STATUS_LOADED) {
        chunk.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
      const lightTmp = (chunk.light[index] & mask) - dec;
      calcNear(chunk, x, y, z, limit - 1, index, lightTmp);
    }
  };
  return calcRecursionInternal;
};

const calcRecursionRedRemove = calcRecursion(0xF000, 0x0FFF, 0x1000, 0);
const calcRecursionGreenRemove = calcRecursion(0x0F00, 0xF0FF, 0x0100, 0);
const calcRecursionBlueRemove = calcRecursion(0x00F0, 0xFF0F, 0x0010, 0);
const calcRecursionGlobalRemove = calcRecursion(0x000F, 0xFFF0, 0x0001, 0);

const calcRecursionRed = calcRecursion(0xF000, 0x0FFF, 0x1000, 1);
const calcRecursionGreen = calcRecursion(0x0F00, 0xF0FF, 0x0100, 1);
const calcRecursionBlue = calcRecursion(0x00F0, 0xFF0F, 0x0010, 1);
const calcRecursionGlobal = calcRecursion(0x000F, 0xFFF0, 0x0001, 1);

const chunkProvider = (store) => {
  class Chunk extends ChunkWithData<Chunk, Terrain> {
    blocks: Uint8Array;
    blocksTextureInfo = blocksTextureInfo;
    blocksFlags = blocksFlags;
    bufferInfo = bufferInfo;
    blocksInfo = blocksInfo;

    constructor(terrain: Terrain, x: number, z: number) {
      super(terrain, x, z);

      this.terrainMipMap = null;

      this.rainfallData = new Uint8Array(256);
      this.temperatureData = new Uint8Array(256);

      this.blocks = new Uint8Array(this.height * 16 * 16);
      this.lightData = new ArrayBuffer(this.height * 16 * 16 * 2);
      this.light = new Uint16Array(this.lightData);
      this.minimapBuffer = new ArrayBuffer(256 * 3);
      this.minimap = new Uint8Array(this.minimapBuffer);
    }

    calcRecursionRed(x: number, y: number, z: number) {
      calcRecursionRed(this, x, y, z, 300);
    }

    calcRecursionGreen(x: number, y: number, z: number) {
      calcRecursionGreen(this, x, y, z, 300);
    }

    calcRecursionBlue(x: number, y: number, z: number) {
      calcRecursionBlue(this, x, y, z, 300);
    }

    calcGlobalRecursion(x: number, y: number, z: number) {
      calcRecursionGlobal(this, x, y, z, 300);
    }

    calcRecursionRedRemove(x: number, y: number, z: number) {
      calcRecursionRedRemove(this, x, y, z, 300);
    }

    calcRecursionGreenRemove(x: number, y: number, z: number) {
      calcRecursionGreenRemove(this, x, y, z, 300);
    }

    calcRecursionBlueRemove(x: number, y: number, z: number) {
      calcRecursionBlueRemove(this, x, y, z, 300);
    }

    calcGlobalRecursionRemove(x: number, y: number, z: number) {
      calcRecursionGlobalRemove(this, x, y, z, 300);
    }

    calcVBO() {
      const buffers = [{
        vertexBuffer: [],
        indexBuffer: [],
        texCoordBuffer: [],
        colorBuffer: [],
        globalColorBuffer: [],
        blockDataBuffer: [],
        vertexCount: 0,
      }, {
        vertexBuffer: [],
        indexBuffer: [],
        texCoordBuffer: [],
        colorBuffer: [],
        globalColorBuffer: [],
        blockDataBuffer: [],
        vertexCount: 0,
      }, {
        vertexBuffer: [],
        indexBuffer: [],
        texCoordBuffer: [],
        colorBuffer: [],
        globalColorBuffer: [],
        blockDataBuffer: [],
        vertexCount: 0,
      }];

      const createPlane = (index, i, j, k, ii, jj, kk, textureIndex, color) => {
        const block = this.blocks[index];
        const { j: jNear, k: kNear, chunkNear } = getChunkNear(j + jj, k + kk, this);
        const indexNear = jNear + (kNear * 16) + ((i + ii) * 256);
        const blockNear = chunkNear.blocks[indexNear];

        if (!(this.blocksFlags[blockNear][1]) || (this.blocksFlags[block][4] && (block === blockNear))) {
          return;
        }
        const buffer = buffers[this.bufferInfo[block][textureIndex]];
        const light = chunkNear.light[indexNear];
        const textureInfo = this.blocksTextureInfo[block][textureIndex] / 16;

        const addVertex = (i, j, k, u, v, uu, vv) => {
          buffer.vertexBuffer.push(
            j + jj + this.x + (ii ? v : kk ? u : (jj < 0 ? 1 : 0)),
            i + ((jj || kk) ? (v - 1) : (ii < 0 ? -1 : 0)),
            k + kk + this.z + ((ii || jj) ? u : (kk < 0 ? 1 : 0)),
          );

          i += ii;
          j += jj;
          k += kk;

          let c = 0;
          let cf = 0;
          let s1f = 0;
          let s1 = 0;
          let s2f = 0;
          let s2 = 0;
          if (ii) {
            [s2f, s2] = getLight(i, j, k + uu, this);
            [s1f, s1] = getLight(i, j + vv, k, this);
            j += vv;
            k += uu;
          } else if (jj) {
            [s2f, s2] = getLight(i, j, k + uu, this);
            [s1f, s1] = getLight(i + vv, j, k, this);
            i += vv;
            k += uu;
          } else if (kk) {
            [s2f, s2] = getLight(i, j + uu, k, this);
            [s1f, s1] = getLight(i + vv, j, k, this);
            i += vv;
            j += uu;
          }


          if (s1 !== -1 || s2 !== -1) {
            [cf, c] = getLight(i, j, k, this);
          }
          const [
            r, g, b, vGlobal,
          ] = getLightColor(light, c, cf, s1, s1f, s2, s2f);

          buffer.colorBuffer.push(r, g, b);
          buffer.globalColorBuffer.push(vGlobal * color);
          buffer.texCoordBuffer.push(textureInfo + u / 16, Math.floor(textureInfo) / 16 + v / 16);
        };

        addVertex(i, j, k, 0, 0, -1, -1);
        addVertex(i, j, k, 0, 1, -1, 1);
        addVertex(i, j, k, 1, 0, 1, -1);
        addVertex(i, j, k, 1, 1, 1, 1);

        buffer.blockDataBuffer.push(block, block, block, block);
        // TODO: create one index buffer per all chunks
        if (ii < 0 || jj > 0 || kk < 0) {
          buffer.indexBuffer.push(buffer.vertexCount, buffer.vertexCount + 1, buffer.vertexCount + 3, buffer.vertexCount, buffer.vertexCount + 3, buffer.vertexCount + 2);
        } else {
          buffer.indexBuffer.push(buffer.vertexCount + 2, buffer.vertexCount + 3, buffer.vertexCount, buffer.vertexCount + 3, buffer.vertexCount + 1, buffer.vertexCount);
        }
        buffer.vertexCount += 4;
      };
      for (let i = 1; i < this.height; i += 1) {
        for (let j = 0; j < 16; j += 1) {
          for (let k = 0; k < 16; k += 1) {
            const index: number = getIndex(j, i, k);
            if (this.blocks[index]) {
              if (!blocksFlags[this.blocks[index]][HAS_GRAPHICS_MODEL]) { // TODO: MODEL
                // top plane
                createPlane(index, i, j, k, 1, 0, 0, 0, 1);
                // bottom plane
                createPlane(index, i, j, k, -1, 0, 0, 1, 0.5);
                // north plane
                createPlane(index, i, j, k, 0, -1, 0, 2, 0.6);
                createPlane(index, i, j, k, 0, 1, 0, 3, 0.6);
                createPlane(index, i, j, k, 0, 0, -1, 4, 0.8);
                createPlane(index, i, j, k, 0, 0, 1, 5, 0.8);
              } else {
                buffers[this.bufferInfo[this.blocks[index]][0]].vertexCount = this.blocksInfo[this.blocks[index]][2].renderToChunk(this, j, i, k, buffers[this.bufferInfo[this.blocks[index]][0]].texCoordBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].vertexBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].indexBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].colorBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].globalColorBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].blockDataBuffer, buffers[this.bufferInfo[this.blocks[index]][0]].vertexCount);
              }
            }
          }
        }
      }

      const buffersInfo = [{
        indexCount: 0,
        index: 0,
        offset: 0,
      }, {
        indexCount: 0,
        index: 1,
        offset: 0,
      }, {
        indexCount: 0,
        index: 2,
        offset: 0,
      }];
      let offset = 0;
      for (let i = 0; i < buffers.length; i += 1) {
        buffersInfo[i].indexCount = buffers[i].indexBuffer.length;
      }
      for (let i = 1; i < buffers.length; i += 1) {
        offset += buffers[i - 1].vertexCount;
        for (let j = 0; j < buffers[i].indexBuffer.length; j += 1) {
          buffers[i].indexBuffer[j] += offset;
        }
        buffersInfo[i].offset = buffersInfo[i - 1].offset + (buffersInfo[i - 1].indexCount * 2);
      }
      const buffersData = buffers.reduce((prev, curr) => ({
        texCoordBuffer: prev.texCoordBuffer.concat(curr.texCoordBuffer),
        vertexBuffer: prev.vertexBuffer.concat(curr.vertexBuffer),
        indexBuffer: prev.indexBuffer.concat(curr.indexBuffer),
        colorBuffer: prev.colorBuffer.concat(curr.colorBuffer),
        globalColorBuffer: prev.globalColorBuffer.concat(curr.globalColorBuffer),
        blockDataBuffer: prev.blockDataBuffer.concat(curr.blockDataBuffer),
      }));
      buffersData.texCoordBuffer = new Float32Array(buffersData.texCoordBuffer).buffer;
      buffersData.vertexBuffer = new Float32Array(buffersData.vertexBuffer).buffer;
      buffersData.indexBuffer = new Uint16Array(buffersData.indexBuffer).buffer;
      buffersData.colorBuffer = new Float32Array(buffersData.colorBuffer).buffer;
      buffersData.globalColorBuffer = new Float32Array(buffersData.globalColorBuffer).buffer;
      buffersData.blockDataBuffer = new Float32Array(buffersData.blockDataBuffer).buffer;

      postMessage({
        type: 'CHUNK_VBO_LOADED',
        payload: {
          geoId: this.geoId,
          buffers: buffersData,
          buffersInfo,
        },
      }, Object.values(buffersData));
    }

    prepareLight() {
      for (let x = 0; x < 16; x += 1) {
        for (let z = 0; z < 16; z += 1) {
          let y = this.height - 1;
          let lightLevel = 15;
          while (y > 0) {
            const index = getIndex(x, y, z);
            if (!this.blocksFlags[this.blocks[index]][1]) {
              lightLevel = 0;
            } else if (!this.blocksFlags[this.blocks[index]][0]) {
              lightLevel -= 1;
            }
            if (!lightLevel) {
              break;
            }
            this.light[index] = lightLevel;
            y -= 1;
          }
          const index = getIndex(x, y, z);

          this.minimap[(x + z * 16) * 3] = this.terrainMipMap[this.blocksTextureInfo[this.blocks[index]][0]][0];
          this.minimap[(x + z * 16) * 3 + 1] = this.terrainMipMap[this.blocksTextureInfo[this.blocks[index]][0]][1];
          this.minimap[(x + z * 16) * 3 + 2] = this.terrainMipMap[this.blocksTextureInfo[this.blocks[index]][0]][2];
        }
      }
      postMessage({ type: 'CHUNK_LOADED_MINIMAP', data: { geoId: this.geoId, minimap: this.minimap } });
    }

    calcGlobalLight() {
      for (let x = 0; x < 16; x += 1) {
        for (let z = 0; z < 16; z += 1) {
          let y = this.height - 1;
          while ((y > 0) && (this.blocksFlags[this.blocks[getIndex(x, y, z)]][1])) {
            y -= 1;
          }
          this.calcGlobalRecursion(x, y + 1, z);
        }
      }
      for (let x = 0; x < 16; x += 1) {
        for (let z = 0; z < 16; z += 1) {
          let y = this.height - 1;
          while (y > 0) {
            const index = getIndex(x, y, z);
            if (this.blocks[index] === 128) {
              this.light[index] = (this.light[index] & 0x000F) | 0xFD20;
              this.calcRecursionRed(x, y, z);
              this.calcRecursionGreen(x, y, z);
              this.calcRecursionBlue(x, y, z);
            }

            y -= 1;
          }
        }
      }
    }

    getBlock(x: number, y: number, z: number) {
      return this.blocks[getIndex(x, y, z)];
    }

    setBlock(x: number, y: number, z: number, value: number) {
      this.blocks[getIndex(x, y, z)] = value;
      this.state = CHUNK_STATUS_NEED_LOAD_VBO;
    }

    putBlock(x: number, y: number, z: number, value: number, plane) {
      let placed = true;
      if (this.blocksInfo[value][2]) {
        placed = this.blocksInfo[value][2].putBlock(this, x, y, z, value, plane);
      } else {
        this.blocks[x + z * 16 + y * 256] = value;
      }
      if (placed) {
        if (!this.blocksFlags[this.blocks[x + z * 16 + y * 256]][0]) {
          this.calcGlobalRecursionRemove(x, y, z);
          y -= 1;
          while ((y > -1) && (!this.blocks[x + z * 16 + y * 256])) {
            this.calcGlobalRecursionRemove(x, y, z);
            y -= 1;
          }
        }
        this.state = CHUNK_STATUS_NEED_LOAD_VBO;
      }
    }

    removeBlock(x: number, y: number, z: number) {
      const index = getIndex(x, y, z);
      const block = this.blocks[index];
      this.blocks[index] = 0;
      const ytmp = y;

      if ((this.light[index + SLICE] & 0xF) === 15) {
        const ytmp2 = y;
        while ((y > -1) && (!this.blocks[index])) {
          this.light[index] = (this.light[index] & 0xFFF0) | 0x000F;
          y -= 1;
        }
        y = ytmp2;
        while ((y > -1) && (!this.blocks[index])) {
          this.calcGlobalRecursion(x, y, z);
          y -= 1;
        }
      } else {
        // TODO - copy from addblock
        this.calcGlobalRecursion(x, y, z);
      }
      y = ytmp;
      if (this.blocksFlags[block][0]) {
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

    updateState() {
      // TODO: remove unnesesary checks for chunk existance
      const updateState = (chunk) => {
        if (chunk && chunk.state !== CHUNK_STATUS_NEED_LOAD_ALL) {
          chunk.updateState();
        }
      };
      if (this.state === CHUNK_STATUS_NEED_LOAD_ALL) {
        this.state = CHUNK_STATUS_NEED_LOAD_LIGHT;
        updateState(this.westChunk);
        updateState(this.eastChunk);

        if ((this.southChunk !== this) && (this.southChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) {
          this.southChunk.updateState();
          updateState(this.southChunk.westChunk);
          updateState(this.southChunk.eastChunk);
        }
        if ((this.northChunk !== this) && (this.northChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) {
          this.northChunk.updateState();
          updateState(this.northChunk.westChunk);
          updateState(this.northChunk.eastChunk);
        }
        this.updateState();
      } else if (this.state === CHUNK_STATUS_NEED_LOAD_LIGHT) {
        // this.state=CHUNK_STATUS_NEED_LOAD_VBO;
        if (this.haveSurroundingChunks && ((this.westChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.eastChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.southChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.northChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.southChunk.westChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.southChunk.eastChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.northChunk.westChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL)) &&
          ((this.northChunk.eastChunk.state !== CHUNK_STATUS_NEED_LOAD_ALL))) {
          this.state = CHUNK_STATUS_NEED_LOAD_VBO;
          this.calcGlobalLight();

          updateState(this.westChunk);
          updateState(this.eastChunk);
          updateState(this.southChunk);
          updateState(this.northChunk);

          this.updateState();
        }
      } else if (this.state === CHUNK_STATUS_NEED_LOAD_VBO) {
        if (this.haveNestedChunks &&
          ((this.westChunk.state === CHUNK_STATUS_NEED_LOAD_VBO || this.westChunk.state === CHUNK_STATUS_LOADED)) &&
          ((this.eastChunk.state === CHUNK_STATUS_NEED_LOAD_VBO || this.eastChunk.state === CHUNK_STATUS_LOADED)) &&
          ((this.southChunk.state === CHUNK_STATUS_NEED_LOAD_VBO || this.southChunk.state === CHUNK_STATUS_LOADED)) &&
          ((this.northChunk.state === CHUNK_STATUS_NEED_LOAD_VBO || this.northChunk.state === CHUNK_STATUS_LOADED))) {
          this.calcVBO();
          this.state = CHUNK_STATUS_LOADED;

          updateState(this.westChunk);
          updateState(this.eastChunk);
          updateState(this.southChunk);
          updateState(this.northChunk);
        }
      }
    }
  }

  return connect(mapState, null, store)(Chunk);
};

/* ::
export const Chunk = chunkProvider();
*/

export default chunkProvider;
