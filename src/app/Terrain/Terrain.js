// @flow
import { mat4 } from 'gl-matrix';
import type { Mat4 } from 'gl-matrix';

import type Material from '../engine/Material';
import { getGeoId } from '../../../common/chunk';
import { connect } from '../util';
import { loadChunk, loadTerrainMipmap } from './terrainActions';
import { gl } from '../engine/glEngine';
import { ITerrainBase } from './TerrainBase';
import { CHUNK_STATUS_LOADED } from './Chunk/chunkConstants';
import type ChunkProgram from '../../shaders/Chunk/Chunk';

const mapActions = () => ({
  loadChunk,
  loadTerrainMipmap,
});

const terrainProvider = (store, Chunk, network, TerrainBase: typeof ITerrainBase) => {
  @connect(null, mapActions, store)
  class Terrain extends TerrainBase {
    loadChunk: typeof loadChunk;
    loadTerrainMipmap: typeof loadTerrainMipmap;
    material: Material;

    constructor() {
      super();
      this.size = 16;
      this.halfSize = 8;

      this.texture = null;
      this.foliageColorMap = [];
      network.route('loadChunk', (data, binaryData) => {
        let chunk = this.chunks.get(getGeoId(data.x, data.z));
        if (!chunk) {
          chunk = this.addChunk(new Chunk(this, data.x, data.z));
        }
        chunk.generateFoliageTexture();
        this.loadChunk({
          data: binaryData, x: data.x, z: data.z, geoId: chunk.geoId,
        });
      });

      network.route('PLACE_BLOCK', this.onServerBlockPlaced.bind(this));
      network.route('REMOVE_BLOCK', this.onServerBlockRemoved.bind(this));
    }

    draw(skyColor, globalColor, pMatrix: Mat4, mvMatrix: Mat4): void {
      const { shader } = (this.material: { shader: ChunkProgram });
      const m = mat4.create();
      mat4.multiply(m, pMatrix, mvMatrix);

      const chunksToRender = [...this.chunks.values()]
        .filter(el => el.state === CHUNK_STATUS_LOADED && el.inFrustum(m));

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.overlayTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, this.overlayTexture); // TODO remove

      // gl.bindTexture(gl.TEXTURE_2D, this.app.glTextureLibrary.textures.get('terrainAnimated').glTexture.textures[0]);

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

      gl.uniform4f(shader.uFogColor, skyColor[0], skyColor[1], skyColor[2], globalColor[3]);
      // TODO: underwater fog goes here
      // if (((this.app.player.blockInDown === 127) && (this.app.player.y - Math.floor(this.app.player.y) < 0.45)) || ((this.app.player.blockInUp === 127) && (this.app.player.y - Math.floor(this.app.player.y) > 0.45))) {
      //   gl.uniform1f(shader.uFogDensity, 0.09);
      //   gl.uniform4f(shader.uFogColor, 0x03 / 256, 0x1C / 256, 0x48 / 256, globalColor[3]);
      //   gl.uniform1i(shader.uFogType, 1);
      // } else {
      gl.uniform1f(shader.uFogDensity, 0.007);
      gl.uniform4f(shader.uFogColor, skyColor[0], skyColor[1], skyColor[2], globalColor[3]);
      gl.uniform1i(shader.uFogType, 0);
      // }

      gl.uniform4f(shader.uGlobalColor, globalColor[0], globalColor[1], globalColor[2], globalColor[3]);

      gl.disable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.activeTexture(gl.TEXTURE1);
      for (const chunk of chunksToRender) {
        gl.bindTexture(gl.TEXTURE_2D, chunk.foliageTexture);
        gl.bindVertexArray(chunk.buffers.vao);
        for (let i = 0; i < chunk.buffersInfo.length - 1; i += 1) {
          if (chunk.buffersInfo[i].indexCount) {
            gl.uniform1i(shader.uBufferNum, chunk.buffersInfo[i].index);
            gl.drawElements(gl.TRIANGLES, chunk.buffersInfo[i].indexCount, gl.UNSIGNED_SHORT, chunk.buffersInfo[i].offset);
          }
        }
      }


      gl.bindVertexArray(null);


      const ii = Chunk.BUFFERS_COUNT - 1;
      gl.enableVertexAttribArray(shader.aVertexPosition);
      gl.enableVertexAttribArray(shader.aTextureCoord);
      gl.enableVertexAttribArray(shader.aVertexColor);
      gl.enableVertexAttribArray(shader.aVertexGlobalColor);
      gl.enableVertexAttribArray(shader.aBlockData);

      gl.uniform1i(shader.uBufferNum, ii);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.disable(gl.CULL_FACE);

      for (const chunk of chunksToRender) {
        if (chunk.buffersInfo[ii].indexCount) {
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers.colorBuffer);
          gl.vertexAttribPointer(shader.aVertexColor, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers.globalColorBuffer);
          gl.vertexAttribPointer(shader.aVertexGlobalColor, 1, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers.texCoordBuffer);
          gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers.vertexBuffer);
          gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers.blockDataBuffer);
          gl.vertexAttribPointer(shader.aBlockData, 1, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.buffers.indexBuffer);
          gl.drawElements(gl.TRIANGLES, chunk.buffersInfo[ii].indexCount, gl.UNSIGNED_SHORT, chunk.buffersInfo[ii].offset);
        }
      }
      gl.enable(gl.CULL_FACE);

      gl.disableVertexAttribArray(shader.aVertexPosition);
      gl.disableVertexAttribArray(shader.aTextureCoord);
      gl.disableVertexAttribArray(shader.aVertexColor);
      gl.disableVertexAttribArray(shader.aVertexGlobalColor);
      gl.disableVertexAttribArray(shader.aBlockData);

      gl.activeTexture(gl.TEXTURE0);
    }

    onServerBlockPlaced(data) {
      const geoId = getGeoId(data.x, data.z);
      const payload = {
        type: 'PLACE_BLOCK', geoId, x: data.x, y: data.y, z: data.z, blockId: data.blockId, plane: data.plane,
      };
      this.app.chunksHandlerThread.postMessage(payload);
      this.app.physicsThread.postMessage(payload);
    }

    onServerBlockRemoved(data) {
      const geoId = getGeoId(data.x, data.z);
      const payload = {
        type: 'REMOVE_BLOCK', geoId, x: data.x, y: data.y, z: data.z,
      };
      this.app.chunksHandlerThread.postMessage(payload);
      this.app.physicsThread.postMessage(payload);
    }

    generateBiomeColorMap(texture) {
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const pixels = new Uint8Array(256 * 256 * 4);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.readPixels(0, 0, 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      }
      this.foliageColorMap = pixels;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    makeMipMappedTextureAtlas(terrainMipMap) {
      this.terrainMipMap = terrainMipMap;
      this.loadTerrainMipmap(this.terrainMipMap);
    }

    generateMinimap() {
      this.minimap = this.app.glTextureLibrary.makeTerrainMinimap(this);
    }

    componentDidUpdate(prevState) {
      const chunkXold = Math.floor(prevState.playerX / 16) * 16;
      const chunkZold = Math.floor(prevState.playerZ / 16) * 16;

      const chunkX = Math.floor(this.playerX / 16) * 16;
      const chunkZ = Math.floor(this.playerZ / 16) * 16;
      if (chunkX !== chunkXold || chunkZ !== chunkZold) {
        this.chunks = new Map([...this.chunks.entries()].filter(([key, value]) => (value.x > chunkX - (this.halfSize * 16))
          && (value.x < chunkX + (this.halfSize * 16))
          && (value.z > chunkZ - (this.halfSize * 16))
          && (value.z < chunkZ + (this.halfSize * 16))));
        // this.filterFarChunks();
      }
    }
  }
  return Terrain;
};

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
