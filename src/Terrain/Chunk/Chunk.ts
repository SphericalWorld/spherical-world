import type { mat4 } from 'gl-matrix';
import ChunkBase from './ChunkBase';
import { gl } from '../../engine/glEngine';
import { CHUNK_STATUS_LOADED } from './chunkConstants';
import type ChunkProgram from '../../shaders/Chunk/Chunk';
import type Terrain from '../Terrain';

import Frustum from '../../engine/Frustum';

let timeOld = 0;
let chunksLoaded = 0;

const createBuffer = (data: ArrayBuffer): WebGLBuffer => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
};

type DataBuffers = {
  vertexBuffer: ArrayBuffer;
  indexBuffer: ArrayBuffer;
};

type GLBuffers = {
  vertexBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  vao: null;
};

type BufferData = Readonly<{
  index: number;
  indexCount: number;
  offset: number;
}>;

export default class Chunk extends ChunkBase {
  frustum: Frustum;
  foliageTexture: WebGLTexture = null;
  rainfallData: Uint8Array;
  temperatureData: Uint8Array;
  buffers: GLBuffers[] = new Array(16).fill(null).map(() => ({
    vertexBuffer: null,
    indexBuffer: null,
    vao: null,
    hasData: false,
  }));

  terrain: Terrain;
  buffersInfo: ReadonlyArray<BufferData>;

  constructor(
    terrain: Terrain,
    blocksData: ArrayBuffer,
    lightData: ArrayBuffer,
    flagsData: ArrayBuffer,
    x: number,
    z: number,
    temperatureData: number[],
    rainfallData: number[],
  ) {
    super(blocksData, lightData, flagsData, x, z);
    this.terrain = terrain;
    this.rainfallData = new Uint8Array(rainfallData);
    this.temperatureData = new Uint8Array(temperatureData);

    this.frustum = new Frustum([
      [x, 0, z],
      [x + 16, 256, z + 16],
    ]);
  }

  generateFoliageTexture(): void {
    const dataArray = new Uint8Array(256 * 3);
    for (let i = 0; i < 256; i += 1) {
      const rainfall = 255 - this.rainfallData[i];
      const temperature = 255 - this.temperatureData[i];
      const index = (256 * rainfall + Math.floor((temperature * rainfall) / 256)) * 4;
      dataArray[i * 3] = this.terrain.foliageColorMap[index];
      dataArray[i * 3 + 1] = this.terrain.foliageColorMap[index + 1];
      dataArray[i * 3 + 2] = this.terrain.foliageColorMap[index + 2];
    }
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, dataArray);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    this.foliageTexture = texture;
  }

  inFrustum(m: mat4): boolean {
    return this.frustum.boxInFrustum(m);
  }

  bindVBO(
    buffers: DataBuffers,
    buffersInfo: ReadonlyArray<BufferData>,
    subchunk: number,
    hasData: boolean,
  ): void {
    const { shader } = this.terrain.material as { shader: ChunkProgram };

    if (!timeOld) {
      timeOld = Date.now();
    }
    chunksLoaded += 1;
    if (chunksLoaded === 12 * 12 * 16) {
      console.log(Date.now() - timeOld);
    }
    const buffersData: GLBuffers = {
      vertexBuffer: null,
      indexBuffer: null,
      vao: null,
      hasData,
      query: gl.createQuery(),
      queryInProgress: false,
      occluded: false,
    };

    if (hasData) {
      setTimeout(() => {
        this.buffers[subchunk] = buffersData;
        buffersData.buffersInfo = buffersInfo;
        buffersData.vao = gl.createVertexArray();
        gl.bindVertexArray(buffersData.vao);

        buffersData.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffersData.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer, gl.STATIC_DRAW);

        buffersData.vertexBuffer = createBuffer(buffers.vertexBuffer);

        gl.enableVertexAttribArray(shader.aVertexPosition);
        gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 40, 0);

        gl.enableVertexAttribArray(shader.aTextureCoord);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 40, 12);

        gl.enableVertexAttribArray(shader.aBlockData);
        gl.vertexAttribPointer(shader.aBlockData, 1, gl.FLOAT, false, 40, 20);

        gl.enableVertexAttribArray(shader.aVertexColor);
        gl.vertexAttribPointer(shader.aVertexColor, 3, gl.FLOAT, false, 40, 24);

        gl.enableVertexAttribArray(shader.aVertexGlobalColor);
        gl.vertexAttribPointer(shader.aVertexGlobalColor, 1, gl.FLOAT, false, 40, 36);
        gl.bindVertexArray(null);
      }, 0);
    }

    this.state = CHUNK_STATUS_LOADED;
  }
}
