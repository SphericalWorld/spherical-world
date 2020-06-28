import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Velocity implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'velocity' = 'velocity';

  linear: vec3 = vec3.create();
  // angular: vec3 = [0, 0, 0];

  constructor(linear: vec3 = vec3.create()) {
    this.linear = linear;
  }
}

/**
 * Component with info about velocity
 * @param {vec3} linear linear velocity
 */
export const VelocityComponent = ({ linear }: { linear?: vec3 }): JSX.Element =>
  new Velocity(linear);
