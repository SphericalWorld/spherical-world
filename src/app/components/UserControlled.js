// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class UserControlled implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'userControlled';
  static componentType: { 'userControlled': UserControlled };

  movingForward = false;
  movingBackward = false;
  movingLeft = false;
  movingRight = false;
  isRunning = false;
  velocity: Vec3 = vec3.create();
}
