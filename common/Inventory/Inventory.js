// @flow strict
export const RARENESS_COMMON: 0 = 0;
export const RARENESS_UNCOMMON: 1 = 1;
export const RARENESS_RARE: 2 = 2;

export type Rareness =
  | typeof RARENESS_COMMON
  | typeof RARENESS_UNCOMMON
  | typeof RARENESS_RARE;

export type Slot = {|
  +itemTypeId: number;
  count: number;
  +name: string;
  +rareness: Rareness;
  +icon?: string;
|};

export type Inventory = {|
  slots: $ReadOnlyArray<Slot | null>;
|};

export const createInventory = ({
  slots = [],
}: {
  slots?: $ReadOnlyArray<Slot | null>
}): Inventory => ({
  slots,
});

export const createStubItems = (): Array<Slot | null> =>
  [
    null,
    {
      name: 'sand', count: 52, itemTypeId: 2, rareness: RARENESS_COMMON,
    },
    null,
    {
      name: 'iron', count: 24, itemTypeId: 9, rareness: RARENESS_UNCOMMON, icon: 'ironIngot',
    },
    {
      name: 'dirt', count: 12, itemTypeId: 1, rareness: RARENESS_COMMON,
    },
    null,
    {
      name: 'diamonds', count: 7, itemTypeId: 100500, rareness: RARENESS_RARE, icon: 'diamond',
    },
    {
      name: 'torch', count: 10, itemTypeId: 128, rareness: RARENESS_COMMON, icon: 'torchOn',
    },
  ];
