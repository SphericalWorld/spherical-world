import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';
import { MemoryManager } from '../../common/ecs/MemoryManager';

export default class Velocity implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'velocity' = 'velocity';
  static memoryManager: MemoryManager;
  static memorySize = 4 * 3;

  readonly linear: vec3 = Velocity.memoryManager.getVec3();
  // angular: vec3 = [0, 0, 0];

  constructor(linear: vec3 = vec3.create()) {
    vec3.copy(this.linear, linear);
  }
}

/**
 * Component with info about velocity
 * @param {vec3} linear linear velocity
 */
export const VelocityComponent = (props: { linear?: vec3 }): JSX.Element => ({
  type: Velocity,
  props,
  key: null,
});
