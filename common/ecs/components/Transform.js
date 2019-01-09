// @flow strict
import type { Vec3, Quat } from 'gl-matrix';
import type { Component } from '../Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import { Networkable } from '../../Networkable';

const PARENT = Symbol('parent');

export default class Transform implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'transform' = 'transform';
  static componentType: {| 'transform': Transform |};
  static networkable = true;

  translation: Vec3 = [0, 0, 0];
  rotation: Quat = [0, 0, 0, 1];
  [PARENT]: any;

  constructor(x: number = 0, y: number = 0, z: number = 0, parent?: any) {
    this.translation[0] = x;
    this.translation[1] = y;
    this.translation[2] = z;
    this[PARENT] = parent;
  }

  static deserialize(data: Transform): Transform {
    return new Transform(data.translation[0], data.translation[1], data.translation[2]);
  }

  serialize(): mixed {
    return this;
  }

  getParent() {
    return this[PARENT];
  }
}
