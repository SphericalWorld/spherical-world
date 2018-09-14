// @flow
import type { Vec3, Quat } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Transform implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'transform' = 'transform';
  static componentType: {| 'transform': Transform |};

  translation: Vec3 = [0, 0, 0];
  rotation: Quat = [0, 0, 0, 1];

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.translation[0] = x;
    this.translation[1] = y;
    this.translation[2] = z;
  }
}
