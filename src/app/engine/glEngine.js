// @flow
import type { Vec3, Mat4, Vec4 } from 'gl-matrix';
import { mat4 } from 'gl-matrix';

export const canvas = document.getElementById('glcanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error();
}

export const gl: WebGLRenderingContext = canvas.getContext('webgl2', { antialias: false });

export function initWebGL() {
  try {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
  } catch (e) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
}

const multiplyVec4 = (
  mat: Mat4,
  vec: Vec4,
  dest: Vec4 = vec,
): Vec4 => {
  const x = vec[0];
  const y = vec[1];
  const z = vec[2];
  const w = vec[3];
  dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
  dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
  dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
  dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
  return dest;
};

export const unproject = (
  winx: number,
  winy: number,
  winz: number,
  mat: Mat4,
  viewport: Vec4,
): Vec3 => {
  const invMat = mat4.create();
  mat4.invert(invMat, mat);
  const n = [
    2 * (winx - viewport[0]) / viewport[2] - 1,
    2 * (winy - viewport[1]) / viewport[3] - 1,
    2 * winz - 1,
    1,
  ];
  multiplyVec4(invMat, n, n);
  return [n[0] / n[3], n[1] / n[3], n[2] / n[3]];
};
