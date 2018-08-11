// @flow
import type { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Physics implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'physics';
}
