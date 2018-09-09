// @flow
import type { Mat4, Vec3 } from 'gl-matrix';
import { mat4, vec3 } from 'gl-matrix';
import type { Component } from '../../../common/ecs/Component';

import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type Viewport = {|
  +viewportWidth: number;
  +viewportHeight: number;
  +pMatrix: Mat4;
|};

export default class Camera implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'camera';
  static componentType: { 'camera': Camera };

  yaw: number = 0;
  pitch: number = 0;
  viewport: Viewport = {
    viewportWidth: 0,
    viewportHeight: 0,
    pMatrix: mat4.identity(mat4.create()),
  };

  mvMatrix: Mat4 = mat4.identity(mat4.create());
  sight: Vec3 = vec3.create();
  worldPosition: Vec3 = vec3.create();
}
