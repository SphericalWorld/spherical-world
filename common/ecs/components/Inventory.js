// @flow strict
import type { Component } from '../Component';
import type { Inventory, Slot } from '../../Inventory/Inventory';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import { createInventory } from '../../Inventory/Inventory';
import { Networkable } from '../../Networkable';

export default class InventoryComponent implements Component, Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static componentType: {| 'inventory': InventoryComponent |};
  static networkable = true;

  data: Inventory

  constructor({ slots }: { slots: $ReadOnlyArray<Slot | null> } = {}) {
    this.data = createInventory({ slots });
  }

  serialize(): mixed {
    return this;
  }

  static deserialize(serialized: InventoryComponent): InventoryComponent {
    const instance = new this(serialized.data);
    return instance;
  }
}
