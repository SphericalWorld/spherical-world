import { mat4, vec3 } from 'gl-matrix';
import type { Component } from '../Component';
import { Networkable } from '../../Networkable';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import { FLOAT32, VEC3, UINT16, MAT4 } from '../MemoryManager';
import type { MemoryManager } from '../MemoryManager';

export type Viewport = {
  viewportWidth: number;
  viewportHeight: number;
  pMatrix: mat4;
};

export default class Camera implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'camera' = 'camera';
  static networkable = true;
  static memoryManager: MemoryManager;

  yaw = Camera.memoryManager.getFloat32();
  pitch = Camera.memoryManager.getFloat32();

  readonly mvMatrix: mat4 = Camera.memoryManager.getMat4();
  readonly sight: vec3 = Camera.memoryManager.getVec3();
  readonly worldPosition: vec3 = Camera.memoryManager.getVec3();
  readonly offset: number;
  readonly viewport: Viewport;

  constructor({ offset, yaw = 0, pitch = 0 }: { yaw: number; pitch: number; offset: number }) {
    this.offset = offset;
    this.viewport = {
      viewportWidth: Camera.memoryManager.getUint16(),
      viewportHeight: Camera.memoryManager.getUint16(),
      pMatrix: Camera.memoryManager.getMat4(),
    };
    mat4.identity(this.viewport.pMatrix);
    this.yaw = yaw;
    this.pitch = pitch;
  }

  serialize(): unknown {
    return {
      yaw: this.yaw,
      pitch: this.pitch,
    };
  }

  static deserialize(serialized: Camera): Camera {
    const instance = new this({});
    instance.yaw = serialized.yaw;
    instance.pitch = serialized.pitch;
    return instance;
  }
}

/**
 * Component to store data about Camera
 */
export const CameraComponent = (props: { yaw: number; pitch: number }): JSX.Element => ({
  type: Camera,
  props,
  key: null,
});
