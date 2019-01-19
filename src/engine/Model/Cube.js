// @flow strict
import type { Vec3 } from 'gl-matrix';
import { gl } from '../glEngine';
import Model from './Model';

const getTextureCoords = () => {
  const textureCoordinates = new Float32Array(48);
  for (let index = 0; index < 48; index += 8) {
    textureCoordinates[index] = 0;
    textureCoordinates[index + 1] = 0;
    textureCoordinates[index + 2] = 0;
    textureCoordinates[index + 3] = 1;
    textureCoordinates[index + 4] = 1;
    textureCoordinates[index + 5] = 0;
    textureCoordinates[index + 6] = 1;
    textureCoordinates[index + 7] = 1;
  }
  return textureCoordinates;
};

const textureCoordsNormal = getTextureCoords();

const textureCoordsCubeMap = [
  // Top face
  0.25, 0.25,
  0.25, 0.00,
  0.50, 0.25,
  0.50, 0.00,

  // Bottom face
  0.25, 0.75,
  0.25, 0.50,
  0.50, 0.75,
  0.50, 0.50,

  // Front face
  0.25, 0.50,
  0.25, 0.25,
  0.50, 0.50,
  0.50, 0.25,

  // Back face
  0.75, 0.50,
  0.75, 0.25,
  1.00, 0.50,
  1.00, 0.25,

  // Right face
  0.50, 0.50,
  0.50, 0.25,
  0.75, 0.50,
  0.75, 0.25,

  // Left face
  0.00, 0.50,
  0.00, 0.25,
  0.25, 0.50,
  0.25, 0.25,
];

const getIndices = () => {
  let indices = [];
  for (let index = 0; index < 6; index += 1) {
    indices = indices.concat([0, 3, 1, 0, 2, 3].map(el => el + index * 4));
  }
  return indices;
};

const cubeVertexIndices = new Uint16Array(getIndices());
const reversedCubeVertexIndices = new Uint16Array(getIndices().reverse());

const createCube = (
  size: number = 1.0,
  isReversed: boolean = false,
  isCubeMap: boolean = false,
  [x, y, z]: Vec3 = [0, 0, 0],
  textureCoordinates?: Float32Array,
): Model => {
  const model = new Model();
  const halfSize = size / 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    // Top face
    x - halfSize, y + halfSize, z + halfSize,
    x - halfSize, y + halfSize, z - halfSize,
    x + halfSize, y + halfSize, z + halfSize,
    x + halfSize, y + halfSize, z - halfSize,

    // Bottom face
    x - halfSize, y - halfSize, z - halfSize,
    x - halfSize, y - halfSize, z + halfSize,
    x + halfSize, y - halfSize, z - halfSize,
    x + halfSize, y - halfSize, z + halfSize,

    // Front face
    x - halfSize, y - halfSize, z + halfSize,
    x - halfSize, y + halfSize, z + halfSize,
    x + halfSize, y - halfSize, z + halfSize,
    x + halfSize, y + halfSize, z + halfSize,

    // Back face
    x + halfSize, y - halfSize, z - halfSize,
    x + halfSize, y + halfSize, z - halfSize,
    x - halfSize, y - halfSize, z - halfSize,
    x - halfSize, y + halfSize, z - halfSize,

    // Right face
    x + halfSize, y - halfSize, z + halfSize,
    x + halfSize, y + halfSize, z + halfSize,
    x + halfSize, y - halfSize, z - halfSize,
    x + halfSize, y + halfSize, z - halfSize,

    // Left face
    x - halfSize, y - halfSize, z - halfSize,
    x - halfSize, y + halfSize, z - halfSize,
    x - halfSize, y - halfSize, z + halfSize,
    x - halfSize, y + halfSize, z + halfSize,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, isReversed ? reversedCubeVertexIndices : cubeVertexIndices, gl.STATIC_DRAW);
  model.elementsCount = 36;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  const textureCoords = isCubeMap
    ? textureCoordsCubeMap
    : textureCoordsNormal;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates || textureCoords),
    gl.STATIC_DRAW,
  );
  return model;
};

export default createCube;
