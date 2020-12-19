import type Chunk from './Chunk';
import { getIndex } from '../../../../common/chunk';

type UVProperties = readonly [number, number, number, number];

type UV = [number, number];
type UVTuple = [UV, UV, UV, UV];

type CubeProperties = Readonly<{
  from: readonly [number, number, number];
  to: readonly [number, number, number];
  faces: Readonly<{
    top?: Readonly<{ texture: string; uv?: UVProperties }>;
    bottom?: Readonly<{ texture: string; uv?: UVProperties }>;
    north?: Readonly<{ texture: string; uv?: UVProperties }>;
    south?: Readonly<{ texture: string; uv?: UVProperties }>;
    west?: Readonly<{ texture: string; uv?: UVProperties }>;
    east?: Readonly<{ texture: string; uv?: UVProperties }>;
  }>;
  textures: {
    [key: string]: number;
  };
}>;

type RenderableFace = Readonly<{
  vertexes: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
  indexes: [number, number, number, number, number, number];
  uv: UVTuple;
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
    // [cf, c] = [1, 0];
  }
  const [r, g, b, vGlobal] = getLightColor(light, c, cf, s1, s1f, s2, s2f);

  return [r, g, b, vGlobal * color];
};

const addVertexTL = addVertex(-1, -1);
const addVertexTR = addVertex(-1, 1);
const addVertexBL = addVertex(1, -1);
const addVertexBR = addVertex(1, 1);

const vertexLightCalc = [addVertexTL, addVertexBL, addVertexBR, addVertexTR];

const defaultUV: UVTuple = [
  [0, 0],
  [1 / 16, 0],
  [1 / 16, 1 / 16],
  [0, 1 / 16],
];

const transformUV = ([u, v, uMax, vMax]: UVProperties): UVTuple => [
  [u / 16 / 16, v / 16],
  [uMax / 16, v / 16],
  [uMax / 16, vMax / 16],
  [u / 16, vMax / 16],
];

const addTexCoordsToUV = (texture: number, uv: UVTuple): UVTuple => {
  const textureU = texture / 16;
  const textureV = Math.floor(textureU) / 16;
  return uv.map<UV>(([u, v]) => [u + textureU, v + textureV]);
};

export class Cube {
  faces: {
    top: RenderableFace;
    bottom: RenderableFace;
    north: RenderableFace;
    south: RenderableFace;
    west: RenderableFace;
    east: RenderableFace;
  };

  textures: {
    [key: string]: number;
  };

  cubeProperies: CubeProperties;

  constructor(cubeProperies: CubeProperties) {
    this.cubeProperies = cubeProperies;
    const {
      from: [x, y, z],
      to: [xTo, yTo, zTo],
    } = cubeProperies;
    this.textures = cubeProperies.textures;
    this.faces = {
      top: {
        vertexes: [
          [x, yTo, z],
          [x, yTo, zTo],
          [xTo, yTo, zTo],
          [xTo, yTo, z],
        ],
        indexes: [0, 1, 2, 2, 3, 0],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.top?.texture],
          cubeProperies.faces.top?.uv ? transformUV(cubeProperies.faces.top.uv) : defaultUV,
        ),
      },
      bottom: {
        vertexes: [
          [x, y, z],
          [x, y, zTo],
          [xTo, y, zTo],
          [xTo, y, z],
        ],
        indexes: [0, 2, 1, 2, 0, 3],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.bottom?.texture],
          cubeProperies.faces.bottom?.uv ? transformUV(cubeProperies.faces.bottom.uv) : defaultUV,
        ),
      },
      north: {
        vertexes: [
          [xTo, y, z],
          [xTo, y, zTo],
          [xTo, yTo, zTo],
          [xTo, yTo, z],
        ],
        indexes: [0, 2, 1, 2, 0, 3],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.north?.texture],
          cubeProperies.faces.north?.uv ? transformUV(cubeProperies.faces.north.uv) : defaultUV,
        ),
      },
      south: {
        vertexes: [
          [x, y, z],
          [x, y, zTo],
          [x, yTo, zTo],
          [x, yTo, z],
        ],
        indexes: [0, 1, 2, 2, 3, 0],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.south?.texture],
          cubeProperies.faces.south?.uv ? transformUV(cubeProperies.faces.south.uv) : defaultUV,
        ),
      },
      west: {
        vertexes: [
          [x, y, zTo],
          [xTo, y, zTo],
          [xTo, yTo, zTo],
          [x, yTo, zTo],
        ],
        indexes: [0, 1, 2, 2, 3, 0],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.west?.texture],
          cubeProperies.faces.west?.uv ? transformUV(cubeProperies.faces.west.uv) : defaultUV,
        ),
      },
      east: {
        vertexes: [
          [x, y, z],
          [xTo, y, z],
          [xTo, yTo, z],
          [x, yTo, z],
        ],
        indexes: [0, 2, 1, 2, 0, 3],
        uv: addTexCoordsToUV(
          this.textures[this.cubeProperies.faces.east?.texture],
          cubeProperies.faces.east?.uv ? transformUV(cubeProperies.faces.east.uv) : defaultUV,
        ),
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
    face: RenderableFace,
    buffers,
    vertexCount: number,
    block: number,
    globalLightIntensity: number,
    chunk: Chunk,
    lightLevel: number,
    dx: number,
    dy: number,
    dz: number,
  ): number {
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
        face.uv[index][0],
        face.uv[index][1],
        block,
        light[0],
        light[1],
        light[2],
        light[3],
      );
    }

    for (let index = 0; index < face.indexes.length; index += 1) {
      buffers.indexBuffer.push(face.indexes[index] + vertexCount);
    }

    return face.vertexes.length;
  }
}
