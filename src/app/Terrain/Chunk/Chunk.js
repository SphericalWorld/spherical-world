// @flow
import { connect } from '../../util';
import ChunkBase from './ChunkBase';
import { gl } from '../../engine/glEngine';
import { CHUNK_STATUS_LOADED } from './chunkConstants';
import type ChunkProgram from '../../../shaders/Chunk/Chunk';
import type { Terrain } from '../Terrain';

import Frustum from '../../engine/Frustum';

const mapState = (state, chunk) => {
  if (!state.chunks.instances[chunk.geoId]) {
    return {};
  }
  return ({
    buffers: state.chunks.instances[chunk.geoId].buffers,
    buffersInfo: state.chunks.instances[chunk.geoId].buffersInfo,
  });
};

let timeOld;
let chunksLoaded = 0;

const createBuffer = (data: ArrayBuffer): WebGLBuffer => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
};

type GLBuffers = {
  vertexBuffer: WebGLBuffer,
  indexBuffer: WebGLBuffer,
  texCoordBuffer: WebGLBuffer,
  colorBuffer: WebGLBuffer,
  globalColorBuffer: WebGLBuffer,
  blockDataBuffer: WebGLBuffer,
  vao: null,
};

const chunkProvider = (store) => {
  class Chunk extends ChunkBase<Chunk, Terrain> {
    frustum: Frustum;
    foliageTexture: WebGLTexture = null;
    rainfallData: Uint8Array;
    temperatureData: Uint8Array;
    buffers: GLBuffers;

    constructor(
      terrain: Terrain,
      x: number,
      z: number,
      temperatureData: number[],
      rainfallData: number[],
    ) {
      super(terrain, x, z);
      this.terrainMipMap = null;
      this.rainfallData = new Uint8Array(rainfallData);
      this.temperatureData = new Uint8Array(temperatureData);

      this.frustum = new Frustum([[this.x, 0, this.z], [this.x + 16, 256, this.z + 16]]);
      this.minimap = null;
    }

    generateFoliageTexture() {
      const dataArray = [];
      for (let i = 0; i < 256; i += 1) {
        const rainfall = 255 - this.rainfallData[i];
        const temperature = 255 - this.temperatureData[i];
        const index = ((256 * rainfall) + Math.floor((temperature * rainfall) / 256)) * 4;
        dataArray.push(
          this.terrain.foliageColorMap[index],
          this.terrain.foliageColorMap[index + 1],
          this.terrain.foliageColorMap[index + 2],
        );
      }
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(dataArray));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      this.foliageTexture = texture;
    }

    inFrustum(m) {
      return this.frustum.boxInFrustum(m);
    }

    bindVBO(buffers, buffersInfo) {
      const { shader } = (this.terrain.material: { shader: ChunkProgram });

      if (!timeOld) {
        timeOld = Date.now();
      }
      chunksLoaded += 1;
      if (chunksLoaded === 12 * 12) {
        console.log(Date.now() - timeOld);
      }

      this.buffers = {
        vertexBuffer: null,
        indexBuffer: null,
        texCoordBuffer: null,
        colorBuffer: null,
        globalColorBuffer: null,
        blockDataBuffer: null,
        vao: null,
      };
      this.buffers.vao = gl.createVertexArray();
      gl.bindVertexArray(this.buffers.vao);

      this.buffers.texCoordBuffer = createBuffer(buffers.texCoordBuffer);
      gl.enableVertexAttribArray(shader.aTextureCoord);
      gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

      this.buffers.vertexBuffer = createBuffer(buffers.vertexBuffer);
      gl.enableVertexAttribArray(shader.aVertexPosition);
      gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

      this.buffers.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer, gl.STATIC_DRAW);

      this.buffers.colorBuffer = createBuffer(buffers.colorBuffer);
      gl.enableVertexAttribArray(shader.aVertexColor);
      gl.vertexAttribPointer(shader.aVertexColor, 3, gl.FLOAT, false, 0, 0);

      this.buffers.globalColorBuffer = createBuffer(buffers.globalColorBuffer);
      gl.enableVertexAttribArray(shader.aVertexGlobalColor);
      gl.vertexAttribPointer(shader.aVertexGlobalColor, 1, gl.FLOAT, false, 0, 0);

      this.buffers.blockDataBuffer = createBuffer(buffers.blockDataBuffer);
      gl.enableVertexAttribArray(shader.aBlockData);
      gl.vertexAttribPointer(shader.aBlockData, 1, gl.FLOAT, false, 0, 0); // TODO: maybe float to uint

      gl.bindVertexArray(null);

      this.state = CHUNK_STATUS_LOADED;
    }

    componentDidUpdate(prevState) {
      if (this.buffers && (prevState.buffers !== this.buffers)) {
        this.bindVBO(this.buffers, this.buffersInfo);
      }
    }
  }
  return connect(mapState, null, store)(Chunk);
};

/* ::
export const Chunk = chunkProvider();
*/

export default chunkProvider;
