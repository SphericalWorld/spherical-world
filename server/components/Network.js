// @flow strict
import type { SocketWrapper } from '../server';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';

export default class Network implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'network' = 'network';
  static componentType: {| 'network': Network |};

  socket: SocketWrapper;

  constructor(socket: SocketWrapper) {
    this.socket = socket;
  }
}
