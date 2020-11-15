import { gl } from '../glEngine';
import type { TexturableShader } from '../../shaders/TexturableShader';
import type { Cube } from '../../chunksHandlerThread/Terrain/Chunk/cube';

const VERTEX_POSITION_SIZE: 3 = 3;
const TEXTURE_COORDINATES_SIZE: 2 = 2;

const renderFace = (face, buffers, vertexCount: number): number => {
  for (let index = 0; index < 4; index += 1) {
    const vertex = face.vertexes[index];
    buffers.vertexPositions.push(vertex[0], vertex[1], vertex[2]);
    buffers.vertexTextureCoords.push(face.uv[index][0], face.uv[index][1]);
  }

  for (let index = 0; index < face.indexes.length; index += 1) {
    buffers.indices.push(face.indexes[index] + vertexCount);
  }

  return face.vertexes.length;
};

export class ModelFromBlock {
  vertexBuffer: WebGLBuffer = gl.createBuffer();
  indexBuffer: WebGLBuffer = gl.createBuffer();
  texCoordBuffer: WebGLBuffer = gl.createBuffer();
  elementsCount = 0;
  vao: WebGLVertexArrayObject = gl.createVertexArray();

  constructor() {}

  createVBO(material) {
    const { shader } = material as { shader: TexturableShader };
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.enableVertexAttribArray(shader.aTextureCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, TEXTURE_COORDINATES_SIZE, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, VERTEX_POSITION_SIZE, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bindVertexArray(null);
  }

  draw(): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.elementsCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  loadFromImageData(block: Cube): void {
    const vertexPositions: number[] = [];
    const indices: number[] = [];
    const vertexTextureCoords: number[] = [];
    let vertexCount = 0;
    const buffers = {
      vertexPositions,
      vertexTextureCoords,
      indices,
    };
    vertexCount += renderFace(block.faces.top, buffers, vertexCount);
    vertexCount += renderFace(block.faces.bottom, buffers, vertexCount);
    vertexCount += renderFace(block.faces.north, buffers, vertexCount);
    vertexCount += renderFace(block.faces.south, buffers, vertexCount);
    vertexCount += renderFace(block.faces.west, buffers, vertexCount);
    vertexCount += renderFace(block.faces.east, buffers, vertexCount);
    // vertexCount += 4;

    // vertexCount += renderFace(0, 0, 0, faces1.bottom, buffers, vertexCount);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);

    this.elementsCount = indices.length;
  }
}

export const createModelFromBlock = (block: Cube): ModelFromBlock => {
  const model = new ModelFromBlock();
  model.loadFromImageData(block);
  return model;
};
