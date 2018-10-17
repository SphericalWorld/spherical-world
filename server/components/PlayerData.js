// @flow strict
import type { Component } from '../../common/ecs/Component';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';

export default class PlayerData implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'playerData' = 'playerData';
  static componentType: {| 'playerData': PlayerData |};

  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
