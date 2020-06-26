import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class UserControlled implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'userControlled' = 'userControlled';

  movingForward = false;
  movingBackward = false;
  movingLeft = false;
  movingRight = false;
  isRunning = false;
  isJumping = false;
  velocity: vec3 = vec3.create();
}

/**
 * Component to make entity controllable by user inputs
 */
export const UserControlledComponent = (_: {}) => new UserControlled();
