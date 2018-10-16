// @flow strict
import type { Socket } from '../network/socket';
import type { Component } from '../../common/ecs/Component';
import type { Entity } from '../../common/ecs/Entity';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';

export default class Network implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'network' = 'network';
  static componentType: {| 'network': Network |};

  socket: Socket;
  linkedPlayers: { +network: Network, +id: Entity }[] = [];

  constructor(socket: Socket) {
    this.socket = socket;
  }

  destructor() {
    for (const player of this.linkedPlayers) {
      player.network.linkedPlayers = player.network.linkedPlayers
        .filter(el => el.id !== this.socket.player.id);
    }
  }
}
