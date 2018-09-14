// @flow
import { gl } from '../glEngine';
import Model from './Model';

const textureCoordsNormal = [
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

const textureCoordsCubeMap = [
  // Front face
  0.25, 0.50,
  0.50, 0.50,
  0.50, 0.25,
  0.25, 0.25,

  // Back face
  0.75, 0.50,
  1.00, 0.50,
  1.00, 0.25,
  0.75, 0.25,

  // Top face
  0.25, 0.25,
  0.50, 0.25,
  0.50, 0.00,
  0.25, 0.00,

  // Bottom face
  0.25, 0.75,
  0.50, 0.75,
  0.50, 0.50,
  0.25, 0.50,

  // Right face
  0.50, 0.50,
  0.75, 0.50,
  0.75, 0.25,
  0.50, 0.25,

  // Left face
  0.00, 0.50,
  0.25, 0.50,
  0.25, 0.25,
  0.00, 0.25,
];

const createCube = (
  size: number = 1.0,
  isReversed: boolean = false,
  isCubeMap: boolean = false,
): Model => {
  const model = new Model();
  const halfSize = size / 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    // Front face
    0.5 - halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 + halfSize,

    // Back face
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,

    // Top face
    0.5 - halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 - halfSize, 0.5 + halfSize, 0.5 - halfSize,

    // Bottom face
    0.5 - halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 - halfSize, 0.5 - halfSize, 0.5 + halfSize,

    // Right face
    0.5 + halfSize, 0.5 - halfSize, 0.5 + halfSize,
    0.5 + halfSize, 0.5 - halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 - halfSize,
    0.5 + halfSize, 0.5 + halfSize, 0.5 + halfSize,

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
  model.elementsCount = 36;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  const textureCoords = isCubeMap
    ? textureCoordsCubeMap
    : textureCoordsNormal;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  return model;
};

export default createCube;
