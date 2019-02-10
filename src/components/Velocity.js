// @flow strict
import { type Vec3, vec3 } from 'gl-matrix';
import { type Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Velocity implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'velocity';
  static componentType: {| 'velocity': Velocity |};

  linear: Vec3 = vec3.create();
  // angular: Vec3 = [0, 0, 0];

  constructor(linear: Vec3 = vec3.create()) {
    this.linear = linear;
  }
}

/**
 * Component with info about velocity
 * @param {Vec3} linear linear velocity
 */
export const VelocityComponent = ({ linear }: {| linear?: Vec3 |}) =>
  // $FlowFixMe
  new Velocity(linear);
