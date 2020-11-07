import type { vec3 } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

/**
 * Component to make entity controllable by user inputs
 */
export class UserControlled extends Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'userControlled' = 'userControlled';

  isRunning = Component.memoryManager.getUint32();
  isJumping = Component.memoryManager.getUint32();
  isMoving = Component.memoryManager.getUint32();

  readonly velocity: vec3 = Component.memoryManager.getVec3();
  readonly movingAxes = Component.memoryManager.getVec2();

  constructor() {
    super();
  }
}
