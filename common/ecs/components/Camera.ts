import { mat4, vec3 } from 'gl-matrix';
import type { Component } from '../Component';
import { Networkable } from '../../Networkable';

import {
  THREAD_MAIN,
  THREAD_PHYSICS,
} from '../../../src/Thread/threadConstants';

export type Viewport = {
  viewportWidth: number;
  viewportHeight: number;
  pMatrix: mat4;
};

export default class Camera implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'camera' = 'camera';
  static networkable = true;

  yaw = 0;
  pitch = 0;
  viewport: Viewport = {
    viewportWidth: 0,
    viewportHeight: 0,
    pMatrix: mat4.identity(mat4.create()),
  };

  mvMatrix: mat4 = mat4.identity(mat4.create());
  sight: vec3 = vec3.create();
  worldPosition: vec3 = vec3.create();

  serialize(): unknown {
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
export const CameraComponent = (props: {}) =>
  // console.log(_) || new Camera();
  Camera.deserialize(props);
