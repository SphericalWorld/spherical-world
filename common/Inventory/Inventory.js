// @flow strict
import {v4 as uuid} from 'uuid';

export const RARENESS_COMMON: 0 = 0;
export const RARENESS_UNCOMMON: 1 = 1;
export const RARENESS_RARE: 2 = 2;

export type Rareness =
  | typeof RARENESS_COMMON
  | typeof RARENESS_UNCOMMON
  | typeof RARENESS_RARE;

export type SlotID = string;

export type Slot = {|
  +id: SlotID;
  +itemTypeId: number;
  count: number;
  +name: string;
  +rareness?: Rareness;
  +icon?: string;
|};

export type Inventory = {|
  slots: Array<SlotID | null>;
  items: $Shape<{| [SlotID]: Slot |}>;
  selectedItem?: SlotID;
|};

export const createInventory = ({
  slots = [],
  items = {},
  selectedItem = null,
}: Inventory): Inventory => ({
  slots,
  items,
  selectedItem,
});

export const putItem = ({ slots, items }: Inventory, item: Slot) => {
  const freeSlot = slots.findIndex(slot => !slot);
  if (freeSlot === -1) return;
  slots[freeSlot] = item.id;
  items[item.id] = item;
};

export const createSlot = ({
  itemTypeId,
  count = 0,
  name,
  rareness,
  icon,
}: {|
  +itemTypeId: number;
  count: number;
  +name: string;
  +rareness?: Rareness;
  +icon?: string;
|}): Slot => ({
  id: uuid(),
  itemTypeId,
  count,
  name,
  rareness,
  icon,
});

export const createStubItems = (): Inventory => ({
  items: {
    id1: {
      id: 'id1', name: 'sand', count: 52, itemTypeId: 2, rareness: RARENESS_COMMON,
    },
    id2: {
      id: 'id2', name: 'iron', count: 24, itemTypeId: 9, rareness: RARENESS_UNCOMMON, icon: 'ironIngot',
    },
    id3: {
      id: 'id3', name: 'dirt', count: 12, itemTypeId: 1, rareness: RARENESS_COMMON,
    },
    id4: {
      id: 'id4', name: 'diamonds', count: 7, itemTypeId: 100500, rareness: RARENESS_RARE, icon: 'diamond',
    },
    id5: {
      id: 'id5', name: 'torch', count: 10, itemTypeId: 128, rareness: RARENESS_COMMON, icon: 'torchOn',
    },
  },
  slots: [
    null,
    'id1',
    null,
    'id2',
    'id3',
    null,
    'id4',
    'id5',
  ],
  selectedItem: 'id1',
});
