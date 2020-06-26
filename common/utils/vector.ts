import type { vec4 } from 'gl-matrix';
import { vec3, mat4 } from 'gl-matrix';

const PI2 = Math.PI * 2;

const multiplyVec4 = (
  mat: mat4,
  vec: vec4,
  dest: vec4 = vec,
): vec4 => {
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
  mat: mat4,
  viewport: vec4,
): vec3 => {
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


export const randomize = (out: vec3, a: vec3, factor: number): vec3 => {
  const u = vec3.normalize(vec3.create(), vec3.fromValues(a[2], a[0], a[1]));
  const v = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), a, u));
  const rad = Math.random() * PI2;
  const multiplierU = Math.cos(rad);
  const multiplierV = Math.sin(rad);
  return vec3.normalize(
    out,
    vec3.scaleAndAdd(
      out,
      vec3.scaleAndAdd(
        v, a, v, multiplierV * factor * Math.random(),
      ),
      u,
      multiplierU * factor * Math.random(),
    ),
  );
};
