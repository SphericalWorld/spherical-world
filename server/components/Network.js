// @flow strict
import type WebSocket from 'ws';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';

export default class Network implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'network' = 'network';
  static componentType: {| 'network': Network |};

  socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
  }
}
