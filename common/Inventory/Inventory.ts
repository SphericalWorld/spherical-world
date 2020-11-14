import { v4 as uuid } from 'uuid';

export const RARENESS_COMMON: 0 = 0;
export const RARENESS_UNCOMMON: 1 = 1;
export const RARENESS_RARE: 2 = 2;

export type Rareness = typeof RARENESS_COMMON | typeof RARENESS_UNCOMMON | typeof RARENESS_RARE;

export type SlotID = string;

export type Slot = {
  id: SlotID;
  itemTypeId: number;
  count: number;
  name: string;
  rareness?: Rareness;
  icon?: string;
};

type InventoryData = {
  slots?: Array<SlotID | null>;
  items?: Record<SlotID, Slot>;
  selectedItem?: SlotID | null;
};

export const createSlot = ({
  itemTypeId,
  count = 0,
  name,
  rareness,
  icon,
}: {
  itemTypeId: number;
  count: number;
  name: string;
  rareness?: Rareness;
  icon?: string;
}): Slot => ({
  id: uuid(),
  itemTypeId,
  count,
  name,
  rareness,
  icon,
});

export class Inventory {
  slots: Array<SlotID | null>;
  items: Record<SlotID, Slot>;
  selectedItem: SlotID | null;

  constructor({ slots = [], items = {}, selectedItem = null }: InventoryData) {
    this.slots = slots;
    this.items = items;
    this.selectedItem = selectedItem;
  }

  putItemIntoFreeSlot(item: Slot): void {
    const freeSlot = this.slots.findIndex((slot) => !slot);
    if (freeSlot === -1) return; // TODO: throw an error and handle it
    this.slots[freeSlot] = item.id;
    this.items[item.id] = item;
  }

  deleteItem(item: Slot): void {
    const slotIndex = this.slots.findIndex((element) => element === item.id);
    this.slots[slotIndex] = null;
    delete this.items[item.id];
  }

  findItemToAdd(item: Slot): Slot | null {
    for (const slot of this.slots) {
      if (slot !== null) {
        const currentItem = this.items[slot];
        if (currentItem.itemTypeId === item.itemTypeId && currentItem.count + item.count < 64) {
          return currentItem;
        }
      }
    }
    return null;
  }

  putItemIntoAnySlots(item: Slot): Slot {
    let inventorySlot = this.findItemToAdd(item);
    if (!inventorySlot) {
      inventorySlot = createSlot({
        count: 0,
        itemTypeId: item.itemTypeId,
      });
      this.putItemIntoFreeSlot(inventorySlot);
    }
    inventorySlot.count += item.count;
    return inventorySlot;
  }

  static create(data: InventoryData): Inventory {
    return new Inventory(data);
  }
}

const isNessesaryAmountItemInInventory = (
  item: { ingredientId: number; amount: number },
  inventoryItems: ReadonlyArray<Slot>,
) => {
  const amountInInventory = inventoryItems.reduce((acc, inventoryItem) => {
    if (inventoryItem.itemTypeId === item.ingredientId) {
      return acc + inventoryItem.count;
    }
    return acc;
  }, 0);
  return amountInInventory >= item.amount;
};

export const canCraft = (
  ingredientsAmountArray: ReadonlyArray<{ ingredientId: number; amount: number }>,
  inventoryItems: ReadonlyArray<Slot>,
): boolean => {
  return ingredientsAmountArray.every((ingredientAmount) =>
    isNessesaryAmountItemInInventory(ingredientAmount, inventoryItems),
  );
};

const findItemSlot = (inventory: Inventory, itemId: number) => {
  for (const slot of inventory.slots) {
    if (slot !== null) {
      const currentItem = inventory.items[slot];
      if (currentItem.itemTypeId === itemId) {
        return currentItem;
      }
    }
  }
  return null;
};

export const decreaseItemAmount = (
  inventory: Inventory,
  ingredientId: number,
  amount: number,
): number => {
  const slotToDecrease = findItemSlot(inventory, ingredientId);
  if (slotToDecrease) {
    if (slotToDecrease.count > amount) {
      slotToDecrease.count -= amount;
      return 0;
    }
    if (slotToDecrease.count < amount) {
      inventory.deleteItem(slotToDecrease);
      return amount - slotToDecrease.count;
    }
    if (slotToDecrease.count === amount) {
      inventory.deleteItem(slotToDecrease);
      return 0;
    }
  }
  return 0;
};

// export const createStubItems = (): Inventory => ({
//   items: {
//     id1: {
//       id: 'id1',
//       name: 'sand',
//       count: 52,
//       itemTypeId: 2,
//       rareness: RARENESS_COMMON,
//     },
//     id2: {
//       id: 'id2',
//       name: 'iron',
//       count: 24,
//       itemTypeId: 9,
//       rareness: RARENESS_UNCOMMON,
//       icon: 'ironIngot',
//     },
//     id3: {
//       id: 'id3',
//       name: 'dirt',
//       count: 12,
//       itemTypeId: 1,
//       rareness: RARENESS_COMMON,
//     },
//     id4: {
//       id: 'id4',
//       name: 'diamonds',
//       count: 7,
//       itemTypeId: 100500,
//       rareness: RARENESS_RARE,
//       icon: 'diamond',
//     },
//     id5: {
//       id: 'id5',
//       name: 'torch',
//       count: 10,
//       itemTypeId: 128,
//       rareness: RARENESS_COMMON,
//       icon: 'torchOn',
//     },
//     id6: {
//       id: 'id1',
//       name: 'sand',
//       count: 22,
//       itemTypeId: 2,
//       rareness: RARENESS_COMMON,
//     },
//   },
//   slots: [
//     null,
//     'id1',
//     null,
//     'id2',
//     'id3',
//     null,
//     'id4',
//     'id5',
//     null,
//     null,
//     'id6',
//     null,
//     null,
//     null,
//     null,
//     null,
//   ],
//   selectedItem: 'id1',
// });
export const createStubItems = (): Inventory => ({
  items: {
    id1: {
      id: 'id1',
      name: 'oak',
      count: 1,
      itemTypeId: 4,
      rareness: RARENESS_COMMON,
    },
    id2: {
      id: 'id2',
      name: 'oak',
      count: 1,
      itemTypeId: 4,
      rareness: RARENESS_COMMON,
    },
    id3: {
      id: 'id3',
      name: 'oak',
      count: 1,
      itemTypeId: 4,
      rareness: RARENESS_COMMON,
    },
  },
  slots: [
    'id1',
    'id2',
    'id3',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  selectedItem: 'id1',
});
