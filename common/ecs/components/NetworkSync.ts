import { Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import type { Networkable } from '../../Networkable';

/**
 * Component to mark entity syncable between client and server
 * @param {name} string name of the object constructor to use for deserializing
 */
export class NetworkSync extends Component<{ name: string }> implements Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'networkSync' = 'networkSync';
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
