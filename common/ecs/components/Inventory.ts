import { Component } from '../Component';
import { Inventory as InventoryData } from '../../Inventory/Inventory';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';
import type { Networkable } from '../../Networkable';

export type InventoryProps = InventoryData;

/**
 * Component to store inventory data
 * @param {SlotID[]} slots array with ids of items in the inventory
 * @param {{[SlotID]: SlotID}} items items stored in the inventory.
 * @param {SlotID} selectedItem item currently selected to perform action with
 */
export class Inventory extends Component<InventoryProps> implements Networkable {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static networkable = true;

  data: InventoryData;

  constructor({ slots, items, selectedItem }: InventoryData = {}) {
    super();
    this.data = InventoryData.create({ slots, items, selectedItem });
  }

  serialize(): unknown {
    const { slots, items } = this.data;
    return {
      data: {
        slots,
        items,
      },
    };
  }

  static deserialize(serialized: Inventory): Inventory {
    const instance = new this(serialized.data);
    return instance;
  }
}
