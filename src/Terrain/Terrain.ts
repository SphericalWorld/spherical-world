import { mat4, vec3 } from 'gl-matrix';
import type { Material } from '../engine/Material/Material';
import type ChunkProgram from '../shaders/Chunk/Chunk';
import { WATER } from '../../common/blocks';
import { toChunkPosition, toPositionInChunk, getGeoId } from '../../common/chunk';
import { PLAYER_CAMERA_HEIGHT } from '../../common/player';
import { gl } from '../engine/glEngine';
import TerrainBase from './TerrainBase';
import { CHUNK_STATUS_LOADED } from './Chunk/chunkConstants';
import Chunk from './Chunk/Chunk';

class Terrain extends TerrainBase<Chunk> {
  material: Material;
  foliageColorMap: Uint8Array = new Uint8Array(256 * 256 * 4);
  chunksToRender: Chunk[] = [];

  loadChunk = (
    blocksData: ArrayBuffer,
    lightData: ArrayBuffer,
    flagsData: ArrayBuffer,
    data: {
      x: number;
      z: number;
      temperature: number[];
      rainfall: number[];
    },
  ): void => {
    this.addChunk(
      new Chunk(
        this,
        blocksData,
        lightData,
        flagsData,
        data.x,
        data.z,
        data.temperature,
        data.rainfall,
      ),
    ).generateFoliageTexture();
  };

  unloadChunk = (x: number, z: number): void => {
    this.chunks.delete(getGeoId(x, z));
  };

  generateBiomeColorMap(texture: WebGLTexture): void {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
      gl.readPixels(0, 0, 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, this.foliageColorMap);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

export const getVisibleChunks = (terrain: Terrain, pMatrix: mat4, mvMatrix: mat4): void => {
  const m = mat4.create();
  mat4.multiply(m, pMatrix, mvMatrix);

  terrain.chunksToRender = [...terrain.chunks.values()].filter(
    (el) => el.state === CHUNK_STATUS_LOADED && el.inFrustum(m),
  ); // TODO cache loaded chunks array
};

const getBlockDetails = (terrain: Terrain, x: number, y: number, z: number) => {
  const chunk = terrain.getChunk(toChunkPosition(x), toChunkPosition(z));
  if (chunk) {
    return chunk.getBlock(toPositionInChunk(x), y + PLAYER_CAMERA_HEIGHT, toPositionInChunk(z));
  }
};

const drawFog = (
  terrain: Terrain,
  shader,
  skyColor: [number, number, number],
  x: number,
  y: number,
  z: number,
) => {
  const blockInDown = getBlockDetails(terrain, x, y, z);
  if (blockInDown === WATER) {
    gl.uniform1f(shader.uFogDensity, 0.09);
    gl.uniform4f(shader.uFogColor, 0x03 / 256, 0x1c / 256, 0x48 / 256, 1);
    gl.uniform1i(shader.uFogType, 1);
  } else {
    gl.uniform1f(shader.uFogDensity, 0.007);
    gl.uniform4f(shader.uFogColor, ...skyColor, 1);
    gl.uniform1i(shader.uFogType, 0);
  }
};

const boxBuffer = gl.createVertexArray();
// const indexBuffer = gl.createBuffer();

// gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
gl.bindVertexArray(boxBuffer);

const [x, y, z]: vec3 = [0, 0, 0];
const subchunkSize = 16;
const getIndices = (): Array<number> => {
  let indices: Array<number> = [];
  for (let index = 0; index < 6; index += 1) {
    indices = indices.concat([0, 3, 1, 0, 2, 3].map((el) => el + index * 4));
  }
  return indices;
};
const cubeVertexIndices = new Uint8Array(getIndices());

const vertices = [
  // Top face
  x,
  y + subchunkSize,
  z + subchunkSize,
  x,
  y + subchunkSize,
  z,
  x + subchunkSize,
  y + subchunkSize,
  z + subchunkSize,
  x + subchunkSize,
  y + subchunkSize,
  z,

  // Bottom face
  x,
  y,
  z,
  x,
  y,
  z + subchunkSize,
  x + subchunkSize,
  y,
  z,
  x + subchunkSize,
  y,
  z + subchunkSize,

  // Front face
  x,
  y,
  z + subchunkSize,
  x,
  y + subchunkSize,
  z + subchunkSize,
  x + subchunkSize,
  y,
  z + subchunkSize,
  x + subchunkSize,
  y + subchunkSize,
  z + subchunkSize,

  // Back face
  x + subchunkSize,
  y,
  z,
  x + subchunkSize,
  y + subchunkSize,
  z,
  x,
  y,
  z,
  x,
  y + subchunkSize,
  z,

  // Right face
  x + subchunkSize,
  y,
  z + subchunkSize,
  x + subchunkSize,
  y + subchunkSize,
  z + subchunkSize,
  x + subchunkSize,
  y,
  z,
  x + subchunkSize,
  y + subchunkSize,
  z,

  // Left face
  x,
  y,
  z,
  x,
  y + subchunkSize,
  z,
  x,
  y,
  z + subchunkSize,
  x,
  y + subchunkSize,
  z + subchunkSize,
];

// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);

gl.bindVertexArray(null);

const tmpVec = vec3.create();

export const drawOpaqueChunkData = (
  terrain: Terrain,
  cameraPosition: vec3,
  skyColor: [number, number, number],
  globalColor: [number, number, number, number],
  pMatrix: mat4,
  mvMatrix: mat4,
  pos,
): void => {
  const { shader } = terrain.material as { shader: ChunkProgram };
  const { chunksToRender } = terrain;
  const matrixCopy = mat4.clone(mvMatrix);

  terrain.material.use();
  terrain.material.shader.use();
  drawFog(terrain, shader, skyColor, cameraPosition[0], cameraPosition[1], cameraPosition[2]);

  gl.uniform4f(shader.uGlobalColor, ...globalColor);

  gl.activeTexture(gl.TEXTURE3);
  for (const chunk of chunksToRender) {
    gl.bindTexture(gl.TEXTURE_2D, chunk.foliageTexture);
    for (let subchunk = 15; subchunk > 0; subchunk -= 1) {
      if (!chunk.buffers[subchunk].hasData) continue;
      if (chunk.buffers[subchunk].occluded) continue;

      const { buffersInfo } = chunk.buffers[subchunk];
      gl.bindVertexArray(chunk.buffers[subchunk].vao);
      vec3.set(tmpVec, chunk.x, 0, chunk.z);
      mat4.translate(mvMatrix, matrixCopy, tmpVec);
      gl.uniformMatrix4fv(terrain.material.shader.uMVMatrix, false, mvMatrix);

      for (let i = 0; i < buffersInfo.length - 1; i += 1) {
        if (buffersInfo[i].indexCount) {
          gl.uniform1i(shader.uBufferNum, buffersInfo[i].index);
          gl.drawElements(
            gl.TRIANGLES,
            buffersInfo[i].indexCount,
            gl.UNSIGNED_SHORT,
            buffersInfo[i].offset,
          );
        }
      }
    }
  }
  // gl.disable(gl.DEPTH_TEST);
  // for (const chunk of chunksToRender) {
  //   gl.bindTexture(gl.TEXTURE_2D, chunk.foliageTexture);
  //   for (let subchunk = 15; subchunk > 0; subchunk -= 1) {
  //     if (!chunk.buffers[subchunk].hasData) continue;
  //     // if (chunk.buffers[subchunk].occluded) console.log(1);
  //     if (chunk.buffers[subchunk].occluded) continue;

  //     const { buffersInfo } = chunk.buffers[subchunk];
  //     gl.bindVertexArray(chunk.buffers[subchunk].vao);

  //     for (let i = 0; i < buffersInfo.length - 1; i += 1) {
  //       if (buffersInfo[i].indexCount) {
  //         gl.uniform1i(shader.uBufferNum, buffersInfo[i].index);
  //         gl.drawElements(
  //           gl.LINES,
  //           buffersInfo[i].indexCount,
  //           gl.UNSIGNED_SHORT,
  //           buffersInfo[i].offset,
  //         );
  //       }
  //     }
  //   }
  // }
  // gl.enable(gl.DEPTH_TEST);

  gl.bindVertexArray(null);

  // gl.bindVertexArray(boundingBoxArray);
  gl.bindVertexArray(boxBuffer);

  // const positionBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, box);
  // gl.bufferData(gl.ARRAY_BUFFER, sphere.boundingBox.geo.positions, gl.STATIC_DRAW);
  // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(0);
  gl.colorMask(false, false, false, false);
  gl.depthMask(false);
  terrain.occlusionCullingShader.use();
  gl.uniformMatrix4fv(terrain.occlusionCullingShader.uPMatrix, false, pMatrix);

  // gl.bindVertexArray(null);
  mvMatrix = mat4.clone(matrixCopy);
  for (const chunk of chunksToRender) {
    for (let subchunk = 15; subchunk > 0; subchunk -= 1) {
      const subchunkData = chunk.buffers[subchunk];
      if (!chunk.buffers[subchunk].hasData) continue;
      vec3.set(tmpVec, chunk.x, 16 * subchunk, chunk.z);
      mat4.translate(mvMatrix, matrixCopy, tmpVec);
      gl.uniformMatrix4fv(terrain.occlusionCullingShader.uMVMatrix, false, mvMatrix);

      // gl.bindVertexArray(box.vao);
      // gl.uniformMatrix4fv(boundingBoxModelMatrixLocation, false, mvMatrix);

      // Check query results here (will be from previous frame or earlier)
      if (
        subchunkData.queryInProgress &&
        gl.getQueryParameter(subchunkData.query, gl.QUERY_RESULT_AVAILABLE)
      ) {
        // console.log(2);
        subchunkData.occluded = !gl.getQueryParameter(subchunkData.query, gl.QUERY_RESULT);
        subchunkData.queryInProgress = false;
      }

      if (!subchunkData.queryInProgress) {
        gl.beginQuery(gl.ANY_SAMPLES_PASSED_CONSERVATIVE, subchunkData.query);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
        // gl.drawElements(gl.LINES, 36, gl.UNSIGNED_SHORT, 0);

        gl.endQuery(gl.ANY_SAMPLES_PASSED_CONSERVATIVE);
        subchunkData.queryInProgress = true;
      }
    }
  }
  const currentChunk = terrain.chunks.get(
    getGeoId(Math.floor(pos[0] / 16) * 16, Math.floor(pos[2] / 16) * 16),
  );
  const toPos = (dimension) => (dimension >= 0 ? dimension % 16 : 16 + (dimension % 16));
  if (currentChunk) {
    const x = toPos(pos[0]);
    const z = toPos(pos[2]);

    const subChunkIndex = Math.floor((pos[1] + PLAYER_CAMERA_HEIGHT) / 16);
    if (currentChunk.buffers[subChunkIndex]) {
      currentChunk.buffers[subChunkIndex].occluded = false;
      // console.log(23);
      if (z <= 0.1) {
        currentChunk.westChunk.buffers[subChunkIndex].occluded = false;
      } else if (z >= 15.9) {
        currentChunk.eastChunk.buffers[subChunkIndex].occluded = false;
      }
      if (x <= 0.1) {
        currentChunk.northChunk.buffers[subChunkIndex].occluded = false;
      } else if (x >= 15.9) {
        currentChunk.southChunk.buffers[subChunkIndex].occluded = false;
      }
    }
  }

  gl.colorMask(true, true, true, true);
  gl.depthMask(true);
  gl.activeTexture(gl.TEXTURE0);
};

export const drawTransparentChunkData = (
  terrain: Terrain,
  cameraPosition: vec3,
  skyColor: [number, number, number],
  globalColor: [number, number, number, number],
  mvMatrix: mat4,
): void => {
  const { shader } = terrain.material as { shader: ChunkProgram };
  const { chunksToRender } = terrain;
  const matrixCopy = mat4.clone(mvMatrix);

  terrain.material.use();

  drawFog(terrain, shader, skyColor, cameraPosition[0], cameraPosition[1], cameraPosition[2]);

  gl.uniform4f(shader.uGlobalColor, ...globalColor);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const ii = 2; // Chunk.BUFFERS_COUNT - 1;
  gl.enableVertexAttribArray(shader.aVertexPosition);
  gl.enableVertexAttribArray(shader.aTextureCoord);
  gl.enableVertexAttribArray(shader.aBlockData);
  gl.enableVertexAttribArray(shader.aVertexColor);
  gl.enableVertexAttribArray(shader.aVertexGlobalColor);

  gl.uniform1i(shader.uBufferNum, ii);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  gl.disable(gl.CULL_FACE);

  for (const chunk of chunksToRender) {
    for (let subchunk = 0; subchunk < 16; subchunk += 1) {
      if (!chunk.buffers[subchunk].hasData) continue;
      if (chunk.buffers[subchunk].occluded) continue;

      const { buffersInfo } = chunk.buffers[subchunk];

      if (buffersInfo[ii].indexCount) {
        vec3.set(tmpVec, chunk.x, 0, chunk.z);
        mat4.translate(mvMatrix, matrixCopy, tmpVec);
        gl.uniformMatrix4fv(shader.uMVMatrix, false, mvMatrix);
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffers[subchunk].vertexBuffer);
        gl.vertexAttribPointer(shader.aVertexPosition, 3, gl.FLOAT, false, 40, 0);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 40, 12);
        gl.vertexAttribPointer(shader.aBlockData, 1, gl.FLOAT, false, 40, 20);
        gl.vertexAttribPointer(shader.aVertexColor, 3, gl.FLOAT, false, 40, 24);
        gl.vertexAttribPointer(shader.aVertexGlobalColor, 1, gl.FLOAT, false, 40, 36);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunk.buffers[subchunk].indexBuffer);
        gl.drawElements(
          gl.TRIANGLES,
          buffersInfo[ii].indexCount,
          gl.UNSIGNED_SHORT,
          buffersInfo[ii].offset,
        );
      }
    }
  }
  gl.enable(gl.CULL_FACE);

  gl.disableVertexAttribArray(shader.aVertexPosition);
  gl.disableVertexAttribArray(shader.aTextureCoord);
  gl.disableVertexAttribArray(shader.aBlockData);
  gl.disableVertexAttribArray(shader.aVertexColor);
  gl.disableVertexAttribArray(shader.aVertexGlobalColor);

  gl.activeTexture(gl.TEXTURE0);
};

export default Terrain;
