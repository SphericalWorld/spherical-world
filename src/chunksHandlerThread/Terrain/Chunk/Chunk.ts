import type { BlockFace } from '../../../../common/block';
import { getIndex } from '../../../../common/chunk';
import {
  BLOCKS_IN_CHUNK,
  BLOCKS_IN_SUBCHUNK,
  CHUNK_WIDTH,
  CHUNK_HEIGHT,
  SLICE,
} from '../../../../common/constants/chunk';
import {
  blocksTextureInfo,
  blocksFlags,
  bufferInfo,
  blocksInfo,
  LIGHT_TRANSPARENT,
} from '../../../blocks/blockInfo';
import ChunkBase from '../../../Terrain/Chunk/ChunkBase';

import {
  CHUNK_STATUS_LOADED,
  CHUNK_STATUS_NEED_LOAD_ALL,
  CHUNK_STATUS_NEED_LOAD_LIGHT,
  CHUNK_STATUS_NEED_LOAD_VBO,
  CHUNK_VBO_LOADED,
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
const createBuffers = (vertexBuffer, indexBuffer): ChunkBuffers => ({
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

const getColorComponent = (
  light: number,
  c: number,
  cf: number,
  s1: number,
  s1f: number,
  s2: number,
  s2f: number,
  count: number,
  halfCount: number,
  shift: number,
) =>
  0.8 **
  (halfCount -
    (((light >>> shift) & 0xf) +
      (s1f ? (s1 >>> shift) & 0xf : 0) +
      (s2f ? (s2 >>> shift) & 0xf : 0) +
      (cf ? (c >>> shift) & 0xf : 0)) /
      count);

const getLightColor = (
  light: number,
  c: number,
  cf: number,
  s1: number,
  s1f: number,
  s2: number,
  s2f: number,
) => {
  const count = 1 + s1f + s2f + cf;
  const halfCount = 17 - count / 2;
  return [
    getColorComponent(light, c, cf, s1, s1f, s2, s2f, count, halfCount, 12),
    getColorComponent(light, c, cf, s1, s1f, s2, s2f, count, halfCount, 8),
    getColorComponent(light, c, cf, s1, s1f, s2, s2f, count, halfCount, 4),
    getColorComponent(light, c, cf, s1, s1f, s2, s2f, count, halfCount, 0),
  ];
};

const getChunkNear = (jOrig: number, kOrig: number, chunk: Chunk) => {
  let j = jOrig;
  let k = kOrig;
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

const getLight = (i: number, j: number, k: number, chunk: Chunk) => {
  const { j: jNear, k: kNear, chunkNear } = getChunkNear(j, k, chunk);
  const index = getIndex(jNear, i, kNear);
  const block = chunkNear.blocks[index];
  if (blocksFlags[block][LIGHT_TRANSPARENT] || blocksFlags[block][4]) {
    return [1, chunkNear.light[index]];
  }
  return [0, -1];
};

const addDefaultVertex = (i: number, j: number, k: number, u: number, v: number) => [
  j + (i ? v : k ? u : j < 0 ? 1 : 0),
  j || k ? v : i < 0 ? 1 : 0,
  k + (i || j ? u : k < 0 ? 1 : 0),
];

const addPlane = (i: number, j: number, k: number): number[][] => [
  addDefaultVertex(i, j, k, 0, 0),
  addDefaultVertex(i, j, k, 0, 1),
  addDefaultVertex(i, j, k, 1, 0),
  addDefaultVertex(i, j, k, 1, 1),
];

const basePlanes = [
  addPlane(-1, 0, 0),
  addPlane(1, 0, 0),
  addPlane(0, -1, 0),
  addPlane(0, 1, 0),
  addPlane(0, 0, -1),
  addPlane(0, 0, 1),
  [
    [0, 0.5, 0],
    [1, 0.5, 0],
    [0, 0.5, 1],
    [1, 0.5, 1],
  ],
];

const addVertex = (u, v) => (
  i: number,
  j: number,
  k: number,
  ii: number,
  jj: number,
  kk: number,
  light: number,
  color: number,
  chunk: Chunk,
) => {
  let c = 0;
  let cf = 0;
  let s1f = 0;
  let s1 = 0;
  let s2f = 0;
  let s2 = 0;
  let iRes = i;
  let jRes = j;
  let kRes = k;
  if (ii) {
    [s2f, s2] = getLight(i, j, k + u, chunk);
    [s1f, s1] = getLight(i, j + v, k, chunk);
    jRes += v;
    kRes += u;
  } else if (jj) {
    [s2f, s2] = getLight(i, j, k + u, chunk);
    [s1f, s1] = getLight(i + v, j, k, chunk);
    iRes += v;
    kRes += u;
  } else if (kk) {
    [s2f, s2] = getLight(i, j + u, k, chunk);
    [s1f, s1] = getLight(i + v, j, k, chunk);
    iRes += v;
    jRes += u;
  }

  if (s1 !== -1 || s2 !== -1) {
    [cf, c] = getLight(iRes, jRes, kRes, chunk);
  }
  const [r, g, b, vGlobal] = getLightColor(light, c, cf, s1, s1f, s2, s2f);

  return [r, g, b, vGlobal * color];
};

const addVertexTL = addVertex(-1, -1);
const addVertexTR = addVertex(-1, 1);
const addVertexBL = addVertex(1, -1);
const addVertexBR = addVertex(1, 1);

const getVertexUV = (index, u, v) => {};

const getTextures = (
  index: 0 | 1 | 2 | 3,
  textureU: number,
  textureV: number,
  textureIndex: number,
  rotation: number,
): [number, number] => {
  switch (index) {
    case 0: {
      if (rotation === 0) {
        return [textureU, textureV];
      }
      if (rotation === 2 || rotation === 4) {
        if (textureIndex === 4 || textureIndex === 5) {
          return [textureU, textureV + 1 / 16];
        }
        return [textureU, textureV];
      }
    }
    case 1: {
      if (rotation === 0) {
        return [textureU, textureV + 1 / 16];
      }
      if (rotation === 2 || rotation === 4) {
        if (textureIndex === 4 || textureIndex === 5) {
          return [textureU + 1 / 16, textureV + 1 / 16];
        }
        return [textureU, textureV + 1 / 16];
      }
    }
    case 2: {
      if (rotation === 0) {
        return [textureU + 1 / 16, textureV];
      }
      if (rotation === 2 || rotation === 4) {
        if (textureIndex === 4 || textureIndex === 5) {
          return [textureU, textureV];
        }
        return [textureU + 1 / 16, textureV];
      }
    }
    case 3: {
      if (rotation === 0) {
        return [textureU + 1 / 16, textureV + 1 / 16];
      }
      if (rotation === 2 || rotation === 4) {
        if (textureIndex === 4 || textureIndex === 5) {
          return [textureU + 1 / 16, textureV];
        }
        return [textureU + 1 / 16, textureV + 1 / 16];
      }
    }
  }
};

const createPlane = (
  chunk: Chunk,
  planes,
  ii: number,
  jj: number,
  kk: number,
  planeIndex: number,
  color,
) => (block, i: number, j: number, k: number, buffers, textureIndex: number, rotation: number) => {
  const { j: jNear, k: kNear, chunkNear } = getChunkNear(j + jj, k + kk, chunk);
  const indexNear = getIndex(jNear, i + ii, kNear);
  const blockNear = chunkNear.blocks[indexNear];

  if (!blocksFlags[blockNear][1] || (blocksFlags[block][4] && block === blockNear)) {
    return;
  }
  const buffer = buffers[bufferInfo[block][planeIndex]];
  const light = chunkNear.light[indexNear];
  const iVertex = i + ii;
  const jVertex = j + jj;
  const kVertex = k + kk;
  const plane = planes[planeIndex];
  const textureU = blocksTextureInfo[block][textureIndex] / 16;
  const textureV = Math.floor(textureU) / 16;

  // if (rotation === 0) {
  //   buffer.vertexBuffer.push(...vertexes[0], ...vertexes[1], ...vertexes[2], ...vertexes[3]);
  // } else if (rotation === 2) {
  //   if (textureIndex === 3 || textureIndex === 4) {
  //     buffer.vertexBuffer.push(...vertexes[3], ...vertexes[0], ...vertexes[1], ...vertexes[2]);
  //   } else {
  //     buffer.vertexBuffer.push(...vertexes[0], ...vertexes[1], ...vertexes[2], ...vertexes[3]);
  //   }
  // }

  buffer.vertexBuffer.push(
    plane[0] + j,
    plane[1] + i,
    plane[2] + k,
    ...getTextures(0, textureU, textureV, textureIndex, rotation),
    block,
    ...addVertexTL(iVertex, jVertex, kVertex, ii, jj, kk, light, color, chunk),

    plane[3] + j,
    plane[4] + i,
    plane[5] + k,
    ...getTextures(1, textureU, textureV, textureIndex, rotation),

    block,
    ...addVertexTR(iVertex, jVertex, kVertex, ii, jj, kk, light, color, chunk),

    plane[6] + j,
    plane[7] + i,
    plane[8] + k,
    ...getTextures(2, textureU, textureV, textureIndex, rotation),

    block,
    ...addVertexBL(iVertex, jVertex, kVertex, ii, jj, kk, light, color, chunk),

    plane[9] + j,
    plane[10] + i,
    plane[11] + k,
    ...getTextures(3, textureU, textureV, textureIndex, rotation),

    block,
    ...addVertexBR(iVertex, jVertex, kVertex, ii, jj, kk, light, color, chunk),
  );

  // TODO: create one index buffer per all chunks
  if (ii < 0 || jj > 0 || kk < 0) {
    buffer.indexBuffer.push(
      buffer.vertexCount,
      buffer.vertexCount + 1,
      buffer.vertexCount + 3,
      buffer.vertexCount,
      buffer.vertexCount + 3,
      buffer.vertexCount + 2,
    );
  } else {
    buffer.indexBuffer.push(
      buffer.vertexCount + 2,
      buffer.vertexCount + 3,
      buffer.vertexCount,
      buffer.vertexCount + 3,
      buffer.vertexCount + 1,
      buffer.vertexCount,
    );
  }

  buffer.vertexCount += 4;
};

type CreatePlane = ReturnType<typeof createPlane>;

export default class Chunk extends ChunkBase {
  minimap: Uint8Array = new Uint8Array(256 * 3);

  westChunk: Chunk = this;
  eastChunk: Chunk = this;
  southChunk: Chunk = this;
  northChunk: Chunk = this;
  surroundingChunks: Chunk[] = [];
  nestedChunks: Chunk[] = [];

  createTopPlaneSlab: CreatePlane;
  createTopPlane: CreatePlane;
  createBottomPlane: CreatePlane;
  createNorthPlane: CreatePlane;
  createSouthPlane: CreatePlane;
  createWestPlane: CreatePlane;
  createEastPlane: CreatePlane;

  constructor(
    binaryData: ArrayBuffer,
    lightData: ArrayBuffer,
    flagsData: ArrayBuffer,
    x: number,
    z: number,
  ) {
    super(binaryData, lightData, flagsData, x, z);

    const planes = basePlanes.map((plane) =>
      [].concat(...plane.map(([x, y, z]) => [x + this.x, y, z + this.z])),
    );
    this.createTopPlane = createPlane(this, planes, 1, 0, 0, 0, 1);
    this.createBottomPlane = createPlane(this, planes, -1, 0, 0, 1, 0.5);
    this.createNorthPlane = createPlane(this, planes, 0, -1, 0, 2, 0.6);
    this.createSouthPlane = createPlane(this, planes, 0, 1, 0, 3, 0.6);
    this.createWestPlane = createPlane(this, planes, 0, 0, -1, 4, 0.8);
    this.createEastPlane = createPlane(this, planes, 0, 0, 1, 5, 0.8);
    this.createTopPlaneSlab = createPlane(this, planes, 1, 0, 0, 0, 1);
  }

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
        if (blocksInfo[block].renderToChunk) {
          // TODO: MODEL
          buffers[bufferInfo[block][0]].vertexCount += blocksInfo[block].renderToChunk(
            this,
            j,
            i,
            k,
            buffers[bufferInfo[block][0]],
          );
        } else {
          const rotation = blocksInfo[block].getRotation(this.flags[index]);
          if (rotation === 0) {
            this.createTopPlane(block, i, j, k, buffers, 0, 0);
            this.createBottomPlane(block, i, j, k, buffers, 1, 0);
            this.createNorthPlane(block, i, j, k, buffers, 2, 0);
            this.createSouthPlane(block, i, j, k, buffers, 3, 0);
            this.createWestPlane(block, i, j, k, buffers, 4, 0);
            this.createEastPlane(block, i, j, k, buffers, 5, 0);
          } else if (rotation === 2) {
            this.createTopPlane(block, i, j, k, buffers, 2, 2);
            this.createBottomPlane(block, i, j, k, buffers, 3, 2);
            this.createNorthPlane(block, i, j, k, buffers, 0, 2);
            this.createSouthPlane(block, i, j, k, buffers, 1, 2);
            this.createWestPlane(block, i, j, k, buffers, 4, 2);
            this.createEastPlane(block, i, j, k, buffers, 5, 2);
          } else if (rotation === 4) {
            this.createTopPlane(block, i, j, k, buffers, 2, 4);
            this.createBottomPlane(block, i, j, k, buffers, 3, 4);
            this.createNorthPlane(block, i, j, k, buffers, 4, 4);
            this.createSouthPlane(block, i, j, k, buffers, 5, 4);
            this.createWestPlane(block, i, j, k, buffers, 0, 4);
            this.createEastPlane(block, i, j, k, buffers, 1, 4);
          }
        }
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
              type: CHUNK_VBO_LOADED,
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
          if (!blocksFlags[this.blocks[index]][1]) {
            lightLevel = 0;
          } else if (!blocksFlags[this.blocks[index]][0]) {
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
        while (y > 0 && blocksFlags[this.blocks[getIndex(x, y, z)]][1]) {
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

  putBlock(x: number, y: number, z: number, value: number, face: BlockFace): void {
    const index = getIndex(x, y, z);
    let placed = true;
    if (blocksInfo[value]) {
      placed = blocksInfo[value].putBlock(this, x, y, z, value, face);
    } else {
      this.blocks[index] = value;
    }
    if (!placed) {
      return;
    }
    this.state = CHUNK_STATUS_NEED_LOAD_VBO;
    if (blocksFlags[this.blocks[getIndex(x, y, z)]][0]) {
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
    if (blocksFlags[block][0]) {
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
