import { vec3 } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

/**
 * Component with info about velocity
 * @param {vec3} linear linear velocity
 */
export class Velocity extends Component<{ linear?: vec3 }> {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'velocity' = 'velocity';

  readonly linear: vec3 = Component.memoryManager.getVec3();
  // angular: vec3 = [0, 0, 0];

  constructor({ linear = vec3.create() }: { linear: vec3 }) {
    super();
    vec3.copy(this.linear, linear);
  }
}
