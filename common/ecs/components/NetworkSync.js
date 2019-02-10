// @flow strict
import type { Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import { Networkable } from '../../Networkable';

export default class NetworkSync implements Component, Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'networkSync' = 'networkSync';
  static componentType: {| 'networkSync': NetworkSync |};
  static networkable = true;

  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  serialize(): mixed {
    return this;
  }
}

/**
 * Component to mark entity syncable between client and server
 * @param {name} string name of the object constructor to use for deserializing
 */
export const NetworkSyncComponent = ({ name }: {| name: string |}) =>
  // $FlowFixMe
  new NetworkSync({ name });
