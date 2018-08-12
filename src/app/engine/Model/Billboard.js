// @flow
import { gl } from '../glEngine';
import Model from './Model';

const createBillboard = (size: number = 1.0) => {
  const model = new Model();
  const halfSize = size / 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    -halfSize, -halfSize, 0,
    halfSize, -halfSize, 0,
    halfSize, +halfSize, 0,
    -halfSize, +halfSize, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  const indices = [
    0, 1, 2, 0, 2, 3,
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  model.elementsCount = 6;

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  const textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  return model;
};

export default createBillboard;
