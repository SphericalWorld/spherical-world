// @flow
import { mat4 } from 'gl-matrix';
import type { Mat4, Vec3 } from 'gl-matrix';
import type { Material } from '../engine/Material/Material';
import { WATER } from '../../common/blocks';
import { toChunkPosition, toPositionInChunk } from '../../common/chunk';
import { BLOCKS_IN_CHUNK } from '../../common/constants/chunk';
import { PLAYER_CAMERA_HEIGHT } from '../../common/player';
import { loadTerrainMipmap } from './terrainActions';
import { gl } from '../engine/glEngine';
import { ITerrainBase } from './TerrainBase';
import { CHUNK_STATUS_LOADED } from './Chunk/chunkConstants';
import type ChunkProgram from '../shaders/Chunk/Chunk';

const terrainProvider = (Chunk, TerrainBase: typeof ITerrainBase) =>
  class Terrain extends TerrainBase {
    loadTerrainMipmap: typeof loadTerrainMipmap;
    material: Material;
    foliageColorMap: Uint8Array = new Uint8Array(256 * 256 * 4);

    loadChunk = (blocksData: ArrayBuffer, data: {
      x: number, z: number, temperature: number[], rainfall: number[],
    }) => {
      let chunk = this.getChunk(data.x, data.z);
      if (chunk.isJust === false) {
        chunk = this.addChunk(new Chunk(this, data.x, data.z, data.temperature, data.rainfall));
      } else {
        chunk = chunk.extract();
      }
      chunk.blocks = new Uint8Array(blocksData, 0, BLOCKS_IN_CHUNK);
      chunk.flags = new Uint8Array(blocksData, BLOCKS_IN_CHUNK);
      chunk.generateFoliageTexture();
    }

    draw(cameraPosition: Vec3, skyColor: number[], globalColor: number[], pMatrix: Mat4, mvMatrix: Mat4): void {
      const { shader } = (this.material: { shader: ChunkProgram });
      const m = mat4.create();
      mat4.multiply(m, pMatrix, mvMatrix);

      const chunksToRender = [...this.chunks.values()]
        .filter(el => el.state === CHUNK_STATUS_LOADED && el.inFrustum(m)); // TODO cache loaded chunks array

      this.material.use();

      const getBlockDetails = (x, y, z) => this
        .getChunk(toChunkPosition(x), toChunkPosition(z))
        .map((chunk) => {
          const blockInDown = chunk.getBlock(toPositionInChunk(x), y + PLAYER_CAMERA_HEIGHT, toPositionInChunk(z));
          if (blockInDown === WATER) {
            gl.uniform1f(shader.uFogDensity, 0.09);
            gl.uniform4f(shader.uFogColor, 0x03 / 256, 0x1C / 256, 0x48 / 256, 1);
            gl.uniform1i(shader.uFogType, 1);
          } else {
            gl.uniform1f(shader.uFogDensity, 0.007);
            gl.uniform4f(shader.uFogColor, ...skyColor, 1);
            gl.uniform1i(shader.uFogType, 0);
          }
        });

      getBlockDetails(cameraPosition[0], cameraPosition[1], cameraPosition[2])

      gl.uniform4f(shader.uGlobalColor, ...globalColor);

      gl.disable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.activeTexture(gl.TEXTURE3);
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

    generateBiomeColorMap(texture: WebGLTexture) {
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.readPixels(0, 0, 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, this.foliageColorMap);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    makeMipMappedTextureAtlas(terrainMipMap) {
      this.terrainMipMap = terrainMipMap;
      // this.loadTerrainMipmap(this.terrainMipMap);
    }

    generateMinimap() {
      this.minimap = this.app.glTextureLibrary.makeTerrainMinimap(this);
    }
  };

/* ::
export const Terrain = terrainProvider();
*/

export default terrainProvider;
