import type { Socket } from '../network/socket';
import type { Component } from '../../common/ecs/Component';
import type { Entity } from '../../common/ecs/Entity';

import { THREAD_MAIN } from '../../src/Thread/threadConstants';

export default class Network implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'network' = 'network';

  socket: Socket;
  linkedPlayers: Readonly<{ network: Network, id: Entity }>[] = [];

  constructor(socket: Socket) {
    this.socket = socket;
  }

  destructor() {
    for (const player of this.linkedPlayers) {
      player.network.linkedPlayers = player.network.linkedPlayers
        .filter(el => el.id !== this.socket.player.id);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON() {}
}
