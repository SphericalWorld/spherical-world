// @flow strict

const playerProvider = (store) => {
  class Inventory {
    constructor() {
      this.items = [{
        item: {
          name: '1',
          hasModel: false,
        },
        slots: [
          null,
          {
            name: 'sand', count: 52, blockId: 2, rarity: 'common',
          },
          null,
          {
            name: 'iron', count: 24, blockId: 9, rarity: 'uncommon', icon: 'textures/items/iron_ingot.png',
          },
          {
            name: 'dirt', count: 12, blockId: 1, rarity: 'common',
          },
          null,
          {
            name: 'diamonds', count: 7, blockId: 100500, rarity: 'rare', icon: 'textures/items/diamond.png',
          },
          {
            name: 'torch', count: 10, blockId: 128, icon: 'textures/blocks/torch_on.png',
          },
        ],
      }, { item: { name: '2', hasModel: false }, slots: [null, { name: 'torch', count: 10, blockId: 128 }] }];
    }
  }
  return Inventory;
};

export default playerProvider;
