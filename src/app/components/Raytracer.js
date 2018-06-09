// @flow
import { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Raytracer implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'raytracer';
}
