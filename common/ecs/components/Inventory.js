// @flow strict
import type { Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import { createInventory } from '../../Inventory/Inventory';
import { Networkable } from '../../Networkable';

export default class Inventory implements Component, Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static componentType: {| 'inventory': Inventory |};
  static networkable = true;

  data = createInventory();

  serialize(): mixed {
    return this;
  }
}
