// @flow strict
import type { Component } from '../../common/ecs/Component';

import { THREAD_MAIN } from '../../src/Thread/threadConstants';

export default class NetworkSync implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'networkSync' = 'networkSync';
  static componentType: {| 'networkSync': NetworkSync |};

  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}
