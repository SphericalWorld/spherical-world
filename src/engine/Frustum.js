// @flow strict
import type { Vec3, Mat4 } from 'gl-matrix';

type BoundingBox = [Vec3, Vec3];

class Frustum {
  boundingBox: BoundingBox;

  constructor(boundingBox: BoundingBox) {
    this.boundingBox = boundingBox;
  }

  boxInFrustum(m: Mat4) {
    let inP = 0;
    let i = 0;
    let j = 0;
    let k = 0;
    let qx;
    let qy;
    let qz;
    let w;
    let x;

    for (i = 0; i < 2; i += 1) {
      qx = this.boundingBox[i][0];
      for (j = 0; j < 2; j += 1) {
        qy = this.boundingBox[j][1];
        for (k = 0; k < 2; k += 1) {
          qz = this.boundingBox[k][2];
          w = qx * m[3] + qy * m[7] + qz * m[11] + m[15];
          x = qx * m[0] + qy * m[4] + qz * m[8] + m[12];
          if (x <= w) {
            inP |= 1;
          }
          if (x >= -w) {
            inP |= 2;
          }
          if (inP === 63) {
            return true;
          }
          x = qx * m[1] + qy * m[5] + qz * m[9] + m[13];
          if (x <= w) {
            inP |= 4;
          }
          if (x >= -w) {
            inP |= 8;
          }
          if (inP === 63) {
            return true;
          }
          x = qx * m[2] + qy * m[6] + qz * m[10] + m[14];
          if (x <= w) {
            inP |= 16;
          }
          if (x >= 0) {
            inP |= 32;
          }
          if (inP === 63) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

export default Frustum;
