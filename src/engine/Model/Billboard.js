// @flow strict
import { gl } from '../glEngine';
import Model from './Model';

const indices = new Uint16Array([0, 3, 1, 0, 2, 3]);
const textureCoords = new Float32Array([
  0.0, 0.0,
  0.0, 1.0,
  1.0, 0.0,
  1.0, 1.0,
]);

const createBillboard = (size: number = 1.0) => {
  const model = new Model();
  const halfSize = size / 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
  const vertices = [
    -halfSize, -halfSize, 0,
    -halfSize, +halfSize, 0,
    +halfSize, -halfSize, 0,
    +halfSize, +halfSize, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);

  model.elementsCount = 6;
  return model;
};

export default createBillboard;
