// @flow
import { gl } from './glEngine';
import Material from './Material';

export const CUBE: 'cube' = 'cube';

const VERTEX_POSITION_SIZE: 3 = 3;
const TEXTURE_COORDINATES_SIZE: 2 = 2;

const createCube = (model, size, halfSize, isReversed) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    // Front face
    0.5 - halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 + halfSize,

    // Back face
    0.5 - halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,

    // Top face
    0.5 - halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,

    // Bottom face
    0.5 - halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 - halfSize, 0.5 + halfSize,

    // Right face
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,

    // Left face
    0.5 - halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 - halfSize,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  const cubeVertexIndices = [
    0, 1, 2, 0, 2, 3, // Front face
    4, 5, 6, 4, 6, 7, // Back face
    8, 9, 10, 8, 10, 11, // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23, // Left face
  ];
  if (isReversed) {
    cubeVertexIndices.reverse();
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  model.indexBuffer.itemSize = 1;
  model.indexBuffer.numItems = 36;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  const textureCoords = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
};

const createBillboard = (model, halfSize) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    -halfSize, -halfSize, 0,
    halfSize, -halfSize, 0,
    halfSize, +halfSize, 0,
    -halfSize, +halfSize, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  const cubeVertexIndices = [
    0, 1, 2, 0, 2, 3,
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  model.indexBuffer.itemSize = 1;
  model.indexBuffer.numItems = 6;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  const textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
};

class Model {
  vertexBuffer: WebGLBuffer = gl.createBuffer();
  indexBuffer: WebGLBuffer = gl.createBuffer();
  texCoordBuffer: WebGLBuffer = gl.createBuffer();
  vao: WebGLVertexArrayObject;

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
    gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  loadFromJson(model, scale: number) {
    // var min = Math.min.apply(this, model.vertexPositions);
    // for (var i = 0; i < model.vertexPositions.length; i++) {
    //  model.vertexPositions[i]-=min;
    // };
    const size = Math.max.apply(this, model.vertexPositions);
    model.vertexPositions = model.vertexPositions.map(el => el / size);
    if (scale) {
      model.vertexPositions = model.vertexPositions.map(el => el * scale);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertexPositions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    this.indexBuffer.itemSize = 1;
    this.indexBuffer.numItems = model.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertexTextureCoords), gl.STATIC_DRAW);
  }

  static createPrimitive(type: string, size: number, isReversed: boolean = false) {
    const model = new this();
    const halfSize = size / 2;
    switch (type) {
      case 'cube':
        createCube(model, size, halfSize, isReversed);
        break;
      case 'billboard':
        createBillboard(model, halfSize);
        break;
      default:
        throw new Error('unknown type');
    }
    return model;
  }
}

export default Model;
