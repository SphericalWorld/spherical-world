import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';
import { MemoryManager, VEC3, BYTE } from '../../common/ecs/MemoryManager';

export default class UserControlled implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'userControlled' = 'userControlled';
  static memoryManager: MemoryManager;
  static memorySize = 8 * BYTE + VEC3;

  data = UserControlled.memoryManager.getDataView(6);

  get movingForward(): number {
    return this.data.getUint8(0);
  }

  set movingForward(val: number) {
    this.data.setUint8(0, val);
  }

  get movingBackward(): number {
    return this.data.getUint8(1);
  }

  set movingBackward(val: number) {
    this.data.setUint8(1, val);
  }

  get movingLeft(): number {
    return this.data.getUint8(2);
  }

  set movingLeft(val: number) {
    this.data.setUint8(2, val);
  }

  get movingRight(): number {
    return this.data.getUint8(3);
  }

  set movingRight(val: number) {
    this.data.setUint8(3, val);
  }

  get isRunning(): number {
    return this.data.getUint8(4);
  }

  set isRunning(val: number) {
    this.data.setUint8(4, val);
  }

  get isJumping(): number {
    return this.data.getUint8(5);
  }

  set isJumping(val: number) {
    this.data.setUint8(5, val);
  }

  velocity: vec3 = UserControlled.memoryManager.getVec3();

  offset: number;

  constructor({ offset }: { offset: number }) {
    this.offset = offset;
  }
}

/**
 * Component to make entity controllable by user inputs
 */
export const UserControlledComponent = (): JSX.Element => ({
  type: UserControlled,
  props: {},
  key: null,
});
