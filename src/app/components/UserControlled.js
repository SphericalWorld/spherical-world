// @flow
import type { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class UserControlled implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];

  movingForward = false;
  movingBackward = false;
  movingLeft = false;
  movingRight = false;
}
