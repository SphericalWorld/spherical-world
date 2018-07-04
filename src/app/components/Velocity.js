// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Velocity {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'velocity';

  linear: Vec3 = vec3.create();
  // angular: Vec3 = [0, 0, 0];

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.linear[0] = x;
    this.linear[1] = y;
    this.linear[2] = z;
  }
}
