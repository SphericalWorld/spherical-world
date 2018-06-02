// @flow
import type { Mat4, Vec3 } from 'gl-matrix';
import { mat4, vec3 } from 'gl-matrix';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Camera {
  static threads = [THREAD_MAIN];
  yaw: number = 0;
  pitch: number = 0;
  mvMatrix: Mat4 = mat4.identity(mat4.create());
  sight: Vec3 = vec3.create();
  worldPosition: Vec3 = vec3.create();
  sight: Vec3 = vec3.create();
}
