// @flow
import { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Player implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'player';
  static componentType: { 'player': Player };
}
