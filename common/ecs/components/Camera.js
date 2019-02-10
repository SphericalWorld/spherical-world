// @flow strict
import type { Mat4, Vec3 } from 'gl-matrix';
import { mat4, vec3 } from 'gl-matrix';
import type { Component } from '../Component';
import { Networkable } from '../../Networkable';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';

export type Viewport = {|
  +viewportWidth: number;
  +viewportHeight: number;
  +pMatrix: Mat4;
|};

export default class Camera implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'camera';
  static componentType: {| 'camera': Camera |};
  static networkable = true;

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


  serialize(): mixed {
    return {
      yaw: this.yaw,
      pitch: this.pitch,
    };
  }

  static deserialize(serialized: Camera): Camera {
    const instance = new this();
    instance.yaw = serialized.yaw;
    instance.pitch = serialized.pitch;
    return instance;
  }
}

/**
 * Component to store data about Camera
 */
export const CameraComponent = (_: {||}) =>
  // $FlowFixMe
  new Camera();
