// @flow strict
import type { Component } from '../Component';
import type { Inventory as InventoryData } from '../../Inventory/Inventory';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import { createInventory } from '../../Inventory/Inventory';
import { Networkable } from '../../Networkable';

export default class Inventory implements Component, Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static componentType: {| 'inventory': Inventory |};
  static networkable = true;

  data: InventoryData;

  constructor({ slots, items, selectedItem }: InventoryData = {}) {
    this.data = createInventory({ slots, items, selectedItem });
  }

  serialize(): mixed {
    const { slots, items } = this.data;
    return {
      data: {
        slots, items,
      },
    };
  }

  static deserialize(serialized: Inventory): Inventory {
    const instance = new this(serialized.data);
    return instance;
  }
}
