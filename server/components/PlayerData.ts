import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';
import type { Networkable } from '../../common/Networkable';

export class PlayerData extends Component<{}> implements Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'playerData' = 'playerData';
  static networkable = true;

  name: string;

  constructor({ name }: { name: string }) {
    super();
    this.name = name;
  }

  serialize(): unknown {
    return this;
  }
}
