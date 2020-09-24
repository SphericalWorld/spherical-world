import { Component } from '../../common/ecs/Component';
import type { Inventory as InventoryData, Slot } from '../../common/Inventory/Inventory';
import { createInventory } from '../../common/Inventory/Inventory';
import { THREAD_MAIN } from '../Thread/threadConstants';
import { blocksInfo } from '../../common/blocks/blocksInfo';

const addItemDefaults = (item: Slot) => {
  if (item.itemTypeId >= 256) return item;
  const block = blocksInfo[item.itemTypeId];
  return { ...item, name: block.name };
};

export type InventoryProps = InventoryData;

/**
 * Component to store inventory data
 * @param {SlotID[]} slots array with ids of items in the inventory
 * @param {{[SlotID]: SlotID}} items items stored in the inventory.
 * @param {SlotID} selectedItem item currently selected to perform action with
 */
export class Inventory extends Component<InventoryProps> {
  static threads = [THREAD_MAIN];
  static componentName: 'inventory' = 'inventory';
  static networkable = true;

  data: InventoryData;

  constructor({ slots, items, selectedItem }: InventoryData = {}) {
    super();
    this.data = createInventory({
      slots,
      items: Object.fromEntries(
        Object.entries(items).map(([key, item]) => [key, addItemDefaults(item)]),
      ),
      selectedItem,
    });
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
