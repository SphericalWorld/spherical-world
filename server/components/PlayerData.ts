import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';
import type { Networkable } from '../../common/Networkable';

type Props = { name: string };

export class PlayerData extends Component<Props> implements Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'playerData' = 'playerData';
  static networkable = true;

  name: string;

  constructor({ name }: Props) {
    super();
    this.name = name;
  }

  serialize(): unknown {
    return this;
  }
}
