// @flow strict
import type { Component } from '../../common/ecs/Component';

import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';
import { Networkable } from '../../common/Networkable';

export default class PlayerData implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'playerData' = 'playerData';
  static componentType: {| 'playerData': PlayerData |};
  static networkable = true;

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  serialize(): mixed {
    return this;
  }
}
