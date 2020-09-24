import type { mat4, vec3 } from 'gl-matrix';
import { Component } from '../Component';
import type { Networkable } from '../../Networkable';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';

export type Viewport = {
  viewportWidth: number;
  viewportHeight: number;
  pMatrix: mat4;
};

/**
 * Component to store data about Camera
 */
export class Camera extends Component<{ yaw: number; pitch: number }> implements Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'camera' = 'camera';
  static networkable = true;

  yaw = Component.memoryManager.getFloat32();
  pitch = Component.memoryManager.getFloat32();

  readonly mvMatrix: mat4 = Component.memoryManager.getMat4();
  readonly sight: vec3 = Component.memoryManager.getVec3();
  readonly worldPosition: vec3 = Component.memoryManager.getVec3();
  readonly viewport: Viewport;

  constructor({ yaw = 0, pitch = 0 }: { yaw: number; pitch: number }) {
    super();
    this.viewport = {
      viewportWidth: Component.memoryManager.getUint16(),
      viewportHeight: Component.memoryManager.getUint16(),
      pMatrix: Component.memoryManager.getMat4(),
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

  update(data: Camera): void {
    if (data.pitch) {
      this.pitch = data.pitch;
    }
    if (data.yaw) {
      this.yaw = data.yaw;
    }
  }
}
