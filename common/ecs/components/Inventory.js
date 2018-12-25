// @flow strict
import type { Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import { createInventory } from '../../Inventory/Inventory';

export default class Inventory implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static componentType: {| 'inventory': Inventory |};

  data = createInventory();
}
