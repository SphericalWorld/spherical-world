import type { Socket } from '../network/socket';
import { Component } from '../../common/ecs/Component';
import type { Entity } from '../../common/ecs/Entity';

import { THREAD_MAIN } from '../../src/Thread/threadConstants';

export class Network extends Component<{ socket: Socket }> {
  static threads = [THREAD_MAIN];
  static componentName: 'network' = 'network';

  socket: Socket;
  linkedPlayers: Readonly<{ network: Network; id: Entity }>[] = [];

  constructor({ socket }: { socket: Socket }) {
    super();
    this.socket = socket;
  }

  destructor(): void {
    for (const player of this.linkedPlayers) {
      player.network.linkedPlayers = player.network.linkedPlayers.filter(
        (el) => el.id !== this.socket.player.id,
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON() {}
}
