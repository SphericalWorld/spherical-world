import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';
import { MemoryManager, VEC3, BYTE } from '../../common/ecs/MemoryManager';

export default class UserControlled implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'userControlled' = 'userControlled';
  static memoryManager: MemoryManager;
  static memorySize = 8 * BYTE + VEC3;

  readonly movingForward = UserControlled.memoryManager.getUint8();
  movingBackward = UserControlled.memoryManager.getUint8();
  movingLeft = UserControlled.memoryManager.getUint8();
  movingRight = UserControlled.memoryManager.getUint8();
  isRunning = UserControlled.memoryManager.getUint8();
  isJumping = UserControlled.memoryManager.getUint8();
  readonly velocity: vec3 = UserControlled.memoryManager.getVec3();

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
