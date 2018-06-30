// @flow
import type { Vec3 } from 'gl-matrix';
import { Component } from './Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Skybox implements Component {
  static threads = [THREAD_MAIN];
  static componentName = 'skybox';

  sunPosition: Vec3 = [0, 0, 0];
}
