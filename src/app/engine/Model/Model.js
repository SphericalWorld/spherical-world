// @flow
import { gl } from '../glEngine';
import Material from '../Material';

const VERTEX_POSITION_SIZE: 3 = 3;
const TEXTURE_COORDINATES_SIZE: 2 = 2;

class Model {
  vertexBuffer: WebGLBuffer = gl.createBuffer();
  indexBuffer: WebGLBuffer = gl.createBuffer();
  texCoordBuffer: WebGLBuffer = gl.createBuffer();
  elementsCount: number;

  vao: WebGLVertexArrayObject;
  // TODO: add vertex count, index count etc
  constructor(model?: Object, scale?: number) {
    if (typeof model === 'object') {
      this.loadFromJson(model, scale);
    }
  }

  createVBO(material: Material) {
    const { shader } = material;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(shader.aVertexPosition);
    // if (shader.aTextureCoord) {
    gl.enableVertexAttribArray(shader.aTextureCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, TEXTURE_COORDINATES_SIZE, gl.FLOAT, false, 0, 0);
    // }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, VERTEX_POSITION_SIZE, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bindVertexArray(null);
  }

  draw(shader) {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.elementsCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  loadFromJson(model, scale?: number = 1) {
    const size = Math.max(...model.vertexPositions);
    let vertexPositions = model.vertexPositions.map(el => el / size);
    if (scale) {
      vertexPositions = vertexPositions.map(el => el * scale);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    this.elementsCount = model.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertexTextureCoords), gl.STATIC_DRAW);
  }
}

export default Model;
