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

  static memorySize = FLOAT32 + FLOAT32 + UINT16 + UINT16 + MAT4 + MAT4 + VEC3 + VEC3;

  data: DataView;

  get yaw(): number {
    return this.data.getFloat32(0);
  }

  set yaw(val: number) {
    this.data.setFloat32(0, val);
  }

  get pitch(): number {
    return this.data.getFloat32(4);
  }

  set pitch(val: number) {
    this.data.setFloat32(4, val);
  }

  // yaw = 0;
  // pitch = 0;

  readonly mvMatrix: mat4 = Camera.memoryManager.getMat4();
  readonly sight: vec3 = Camera.memoryManager.getVec3();
  readonly worldPosition: vec3 = Camera.memoryManager.getVec3();
  readonly offset: number;
  readonly viewport: Viewport;

  constructor({ offset, yaw = 0, pitch = 0 }: { yaw: number; pitch: number; offset: number }) {
    const data = Camera.memoryManager.getDataView(FLOAT32 + FLOAT32 + UINT16 + UINT16);
    this.data = data;
    this.offset = offset;
    this.viewport = {
      get viewportWidth(): number {
        return data.getUint16(8);
      },
      set viewportWidth(val: number) {
        data.setUint16(8, val);
      },
      get viewportHeight(): number {
        return data.getUint16(10);
      },
      set viewportHeight(val: number) {
        data.setUint16(10, val);
      },
      pMatrix: mat4.identity(Camera.memoryManager.getMat4()),
    };
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
