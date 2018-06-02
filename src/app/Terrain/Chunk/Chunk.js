// @flow
import { connect } from '../../util';
import ChunkBase from './ChunkBase';
import { gl } from '../../engine/glEngine';
import { CHUNK_STATUS_LOADED } from './chunkConstants';
import type { Terrain } from '../Terrain';

import Frustum from '../../engine/Frustum';

const mapState = (state, chunk) => {
  if (!state.chunks.instances[chunk.geoId]) {
    return {};
  }
  return ({
    buffers: state.chunks.instances[chunk.geoId].buffers,
  });
};

let timeOld;
let chunksLoaded = 0;

const chunkProvider = (store) => {
  @connect(mapState, null, store)
  class Chunk extends ChunkBase<Chunk, Terrain> {
    frustum: Frustum;
    foliageTexture: WebGLTexture = null;

    constructor(terrain: Terrain, x: number, z: number) {
      super(terrain, x, z);

      this.terrainMipMap = null;

      this.rainfallDataBuffer = new ArrayBuffer(256);
      this.rainfallData = new Uint8Array(this.rainfallDataBuffer);
      this.temperatureDataBuffer = new ArrayBuffer(256);
      this.temperatureData = new Uint8Array(this.temperatureDataBuffer);

      this.frustum = new Frustum([[this.x, 0, this.z], [this.x + 16, 256, this.z + 16]]);
      this.minimap = null;
    }

    generateFoliageTexture() {
      const dataArray = [];
      for (let i = 0; i < 256; i += 1) {
        this.rainfallData[i] = this.x + 64;
        this.temperatureData[i] = 64 + this.z;
        dataArray.push(this.terrain.foliageColorMap[this.rainfallData[i] * 256 + this.temperatureData[i] * 4], this.terrain.foliageColorMap[this.rainfallData[i] * 256 + this.temperatureData[i] * 4 + 1], this.terrain.foliageColorMap[this.rainfallData[i] * 256 + this.temperatureData[i] * 4 + 2]);
      }
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(dataArray));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      this.foliageTexture = texture;
    }

    inFrustum(m) {
      return this.frustum.boxInFrustum(m);
    }

    bindVBO(data) {
      const shader = this.terrain.material.shader;
      if (!timeOld) {
        timeOld = Date.now();
      }
      chunksLoaded += 1;
      if (chunksLoaded === 12 * 12) {
        console.log(Date.now() - timeOld);
      }

      this.buffers = [{
        vertexBuffer: null,
        indexBuffer: null,
        texCoordBuffer: null,
        colorBuffer: null,
        globalColorBuffer: null,
        blockDataBuffer: null,
        vao: null,
        itemCount: 0,
      }, {
        vertexBuffer: null,
        indexBuffer: null,
        texCoordBuffer: null,
        colorBuffer: null,
        globalColorBuffer: null,
        blockDataBuffer: null,
        vao: null,
        itemCount: 0,
      }, {
        vertexBuffer: null,
        indexBuffer: null,
        texCoordBuffer: null,
        colorBuffer: null,
        globalColorBuffer: null,
        blockDataBuffer: null,
        vao: null,
        itemCount: 0,
      }];
      for (let i = 0; i < this.buffers.length; i += data.buffers.length - 1) {
        this.buffers[i].vao = gl.createVertexArray();
        gl.bindVertexArray(this.buffers[i].vao);

        this.buffers[i].texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i].texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffers[i].texCoordBuffer, gl.STATIC_DRAW);
        this.buffers[i].texCoordBuffer.itemSize = 2;
        gl.enableVertexAttribArray(shader.aTextureCoord);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        this.buffers[i].vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i].vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffers[i].vertexBuffer, gl.STATIC_DRAW);
        this.buffers[i].vertexBuffer.itemSize = 3;
        gl.enableVertexAttribArray(shader.aVertexPosition);
        gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        this.buffers[i].indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers[i].indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.buffers[i].indexBuffer, gl.STATIC_DRAW);
        this.buffers[i].indexBuffer.itemSize = 2;

        this.buffers[i].indexBuffer.itemCount = data.buffers[i].indexCount;

        this.buffers[i].colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i].colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffers[i].colorBuffer, gl.STATIC_DRAW);
        this.buffers[i].colorBuffer.itemSize = 3;
        gl.enableVertexAttribArray(shader.aVertexColor);
        gl.vertexAttribPointer(shader.aVertexColor, 3, gl.FLOAT, false, 0, 0);

        this.buffers[i].globalColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i].globalColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffers[i].globalColorBuffer, gl.STATIC_DRAW);
        this.buffers[i].globalColorBuffer.itemSize = 1;
        gl.enableVertexAttribArray(shader.aVertexGlobalColor);
        gl.vertexAttribPointer(shader.aVertexGlobalColor, 1, gl.FLOAT, false, 0, 0);

        this.buffers[i].blockDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i].blockDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffers[i].blockDataBuffer, gl.STATIC_DRAW);
        this.buffers[i].blockDataBuffer.itemSize = 1;
        gl.enableVertexAttribArray(shader.aBlockData);
        gl.vertexAttribPointer(shader.aBlockData, 1, gl.FLOAT, false, 0, 0); // TODO: maybe float to uint

        gl.bindVertexArray(null);
      }

      for (let i = 0; i < data.buffers.length; i += 1) {
        this.buffers[i].itemCount = data.buffers[i].indexCount;
      }
      this.state = CHUNK_STATUS_LOADED;
    }

    componentDidUpdate(prevState) {
      if (this.buffers && (prevState.buffers !== this.buffers)) {
        this.bindVBO({ buffers: this.buffers });
      }
    }
  }

  return Chunk;
};

/* ::
export const Chunk = chunkProvider();
*/

export default chunkProvider;
