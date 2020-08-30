import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';
import type { MemoryManager } from '../../common/ecs/MemoryManager';

export default class Velocity implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'velocity' = 'velocity';
  static memoryManager: MemoryManager;

  readonly linear: vec3 = Velocity.memoryManager.getVec3();
  // angular: vec3 = [0, 0, 0];

  constructor({ offset, linear = vec3.create() }: { linear: vec3 }) {
    this.offset = offset;

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
