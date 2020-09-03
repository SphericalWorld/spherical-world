import type Chunk from './Chunk';
import { getIndex } from '../../../../common/chunk';

type UVProperties = [number, number, number, number];

type CubeProperties = Readonly<{
  from: [number, number, number];
  to: [number, number, number];
  faces: Readonly<{
    top?: { texture: number; uv?: UVProperties };
    bottom?: { texture: number; uv?: UVProperties };
    north?: { texture: number; uv?: UVProperties };
    south?: { texture: number; uv?: UVProperties };
    west?: { texture: number; uv?: UVProperties };
    east?: { texture: number; uv?: UVProperties };
  }>;
}>;

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

const getChunkNear = (xOrig: number, zOrig: number, chunk: Chunk) => {
  let x = xOrig;
  let z = zOrig;
  let chunkNear = chunk;
  if (x === -1) {
    x = 15;
    chunkNear = chunkNear.northChunk;
  } else if (x === 16) {
    x = 0;
    chunkNear = chunkNear.southChunk;
  }
  if (z === -1) {
    z = 15;
    chunkNear = chunkNear.westChunk;
  } else if (z === 16) {
    z = 0;
    chunkNear = chunkNear.eastChunk;
  }
  return { x, z, chunkNear };
};

const getLight = (x: number, y: number, z: number, chunk: Chunk) => {
  const { x: xNear, z: zNear, chunkNear } = getChunkNear(x, z, chunk);
  const index = getIndex(xNear, y, zNear);
  const block = chunkNear.blocks[index];

  if (chunkNear.blocksInfo[block].lightTransparent || chunkNear.blocksInfo[block].selfTransparent) {
    return [1, chunkNear.light[index]];
  }
  return [0, -1];
};

const addVertex = (u: number, v: number) => (
  x: number,
  y: number,
  z: number,
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
  let xRes = x;
  let yRes = y;
  let zRes = z;
  if (ii) {
    [s2f, s2] = getLight(x, y, z + u, chunk);
    [s1f, s1] = getLight(x + v, y, z, chunk);
    xRes += v;
    zRes += u;
  } else if (jj) {
    [s2f, s2] = getLight(x, y, z + u, chunk);
    [s1f, s1] = getLight(x, y + v, z, chunk);
    yRes += v;
    zRes += u;
  } else if (kk) {
    [s2f, s2] = getLight(x + u, y, z, chunk);
    [s1f, s1] = getLight(x, y + v, z, chunk);
    yRes += v;
    xRes += u;
  }

  if (s1 !== -1 || s2 !== -1) {
    [cf, c] = getLight(xRes, yRes, zRes, chunk);
  }
  const [r, g, b, vGlobal] = getLightColor(light, c, cf, s1, s1f, s2, s2f);

  return [r, g, b, vGlobal * color];
};

const addVertexTL = addVertex(-1, -1);
const addVertexTR = addVertex(-1, 1);
const addVertexBL = addVertex(1, -1);
const addVertexBR = addVertex(1, 1);

const vertexLightCalc = [addVertexBL, addVertexTL, addVertexBR, addVertexTR];

const defaultUV = [
  [1 / 16, 1 / 16],
  [0, 1 / 16],
  [1 / 16, 0],
  [0, 0],
];

const transformUV = ([u, v, uMax, vMax]: [number, number, number, number]) => [
  [uMax / 16, vMax / 16],
  [u / 16, vMax / 16],
  [uMax / 16, v / 16],
  [u / 16 / 16, v / 16],
];

export class Cube {
  faces: {
    top: number[];
    bottom: number[];
    north: number[];
    south: number[];
    west: number[];
    east: number[];
  };

  cubeProperies: CubeProperties;

  constructor(cubeProperies: CubeProperties) {
    this.cubeProperies = cubeProperies;
    const {
      from: [x, y, z],
      to: [xTo, yTo, zTo],
    } = cubeProperies;
    this.faces = {
      top: {
        vertexes: [
          [x, yTo, zTo],
          [x, yTo, z],
          [xTo, yTo, zTo],
          [xTo, yTo, z],
        ],
        indexes: [0, 3, 1, 0, 2, 3],
        uv: cubeProperies.faces.top?.uv ? transformUV(cubeProperies.faces.top.uv) : defaultUV,
      },
      bottom: {
        vertexes: [
          [x, y, zTo],
          [x, y, z],
          [xTo, y, zTo],
          [xTo, y, z],
        ],
        indexes: [0, 1, 3, 0, 3, 2],
        uv: cubeProperies.faces.bottom?.uv ? transformUV(cubeProperies.faces.bottom.uv) : defaultUV,
      },
      north: {
        vertexes: [
          [xTo, y, zTo],
          [xTo, y, z],
          [xTo, yTo, zTo],
          [xTo, yTo, z],
        ],
        indexes: [0, 1, 3, 0, 3, 2],
        uv: cubeProperies.faces.north?.uv ? transformUV(cubeProperies.faces.north.uv) : defaultUV,
      },
      south: {
        vertexes: [
          [x, y, z],
          [x, y, zTo],
          [x, yTo, z],
          [x, yTo, zTo],
        ],
        indexes: [0, 1, 3, 0, 3, 2],
        uv: cubeProperies.faces.south?.uv ? transformUV(cubeProperies.faces.south.uv) : defaultUV,
      },
      west: {
        vertexes: [
          [xTo, yTo, zTo],
          [x, yTo, zTo],
          [xTo, y, zTo],
          [x, y, zTo],
        ],
        indexes: [0, 1, 3, 0, 3, 2],
        uv: cubeProperies.faces.west?.uv ? transformUV(cubeProperies.faces.west.uv) : defaultUV,
      },
      east: {
        vertexes: [
          [xTo, yTo, z],
          [x, yTo, z],
          [xTo, y, z],
          [x, y, z],
        ],
        indexes: [0, 3, 1, 0, 2, 3],
        uv: cubeProperies.faces.east?.uv ? transformUV(cubeProperies.faces.east.uv) : defaultUV,
      },
    };
  }

  render(
    chunk: Chunk,
    x: number,
    y: number,
    z: number,
    buffers: {
      vertexBuffer: number[];
      indexBuffer: number[];
      vertexCount: number;
    },
    block: number,
  ): number {
    let vertexCount = 0;
    // if (chunk.getBlock(x, y + 1, z))
    let indexNear = getIndex(x, y + 1, z);
    let blockNear = chunk.blocksInfo[chunk.blocks[indexNear]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.top,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.top?.texture,
        block,
        1,
        chunk,
        chunk.light[indexNear],
        0,
        1,
        0,
      );
      vertexCount += 4;
    }

    indexNear = getIndex(x, y - 1, z);
    blockNear = chunk.blocksInfo[chunk.blocks[getIndex(x, y - 1, z)]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.bottom,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.bottom?.texture,
        block,
        0.5,
        chunk,
        chunk.light[indexNear],
        0,
        -1,
        0,
      );
      vertexCount += 4;
    }

    let { x: xNear, z: zNear, chunkNear } = getChunkNear(x + 1, z, chunk);
    indexNear = getIndex(xNear, y, zNear);
    blockNear = chunkNear.blocksInfo[chunkNear.blocks[indexNear]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.north,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.north?.texture,
        block,
        0.6,
        chunk,
        chunkNear.light[indexNear],
        1,
        0,
        0,
      );
      vertexCount += 4;
    }

    ({ x: xNear, z: zNear, chunkNear } = getChunkNear(x - 1, z, chunk));
    indexNear = getIndex(xNear, y, zNear);
    blockNear = chunkNear.blocksInfo[chunkNear.blocks[indexNear]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.south,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.south?.texture,
        block,
        0.6,
        chunk,
        chunkNear.light[indexNear],
        -1,
        0,
        0,
      );
      vertexCount += 4;
    }

    ({ x: xNear, z: zNear, chunkNear } = getChunkNear(x, z + 1, chunk));
    indexNear = getIndex(xNear, y, zNear);
    blockNear = chunkNear.blocksInfo[chunkNear.blocks[indexNear]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.west,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.west?.texture,
        block,
        0.8,
        chunk,
        chunkNear.light[indexNear],
        0,
        0,
        1,
      );
      vertexCount += 4;
    }

    ({ x: xNear, z: zNear, chunkNear } = getChunkNear(x, z - 1, chunk));
    indexNear = getIndex(xNear, y, zNear);
    blockNear = chunkNear.blocksInfo[chunkNear.blocks[indexNear]];
    if (blockNear.sightTransparent && !(blockNear.selfTransparent && blockNear.id === block)) {
      this.renderFace(
        x,
        y,
        z,
        this.faces.east,
        buffers,
        buffers.vertexCount + vertexCount,
        this.cubeProperies.faces.east?.texture,
        block,
        0.8,
        chunk,
        chunkNear.light[indexNear],
        0,
        0,
        -1,
      );
      vertexCount += 4;
    }

    return vertexCount;
  }

  renderFace(
    x: number,
    y: number,
    z: number,
    face,
    buffers,
    vertexCount: number,
    texture,
    block: number,
    globalLightIntensity: number,
    chunk,
    lightLevel: number,
    dx: number,
    dy: number,
    dz: number,
  ): number {
    // if (chunk.getBlock(x, y + 1, z))
    const textureU = texture / 16;
    const textureV = Math.floor(textureU) / 16;

    for (let index = 0; index < 4; index += 1) {
      const vertex = face.vertexes[index];
      const light = vertexLightCalc[index](
        x + dx,
        y + dy,
        z + dz,
        dy,
        dx,
        dz,
        lightLevel,
        globalLightIntensity,
        chunk,
      );
      buffers.vertexBuffer.push(
        vertex[0] + x,
        vertex[1] + y,
        vertex[2] + z,
        face.uv[index][0] + textureU,
        face.uv[index][1] + textureV,
        block,
        light[0],
        light[1],
        light[2],
        light[3],
      );
    }

    for (let index = 0; index < face.indexes.length; index++) {
      buffers.indexBuffer.push(face.indexes[index] + vertexCount);
    }
    // buffers.indexBuffer.push(...this.faces.top.indexes);

    return face.vertexes.length;
  }
}
