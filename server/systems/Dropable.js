// @flow strict
import { vec3 } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import {
  Transform,
  Item,
  Inventory,
  PlayerData,
} from '../components';
import { createSlot, putItem } from '../../common/Inventory';

const findItemToAdd = (inventory, item) => {
  for (const slot of inventory.data.slots) {
    if (slot !== null) {
      const currentItem = inventory.data.items[slot];
      if (currentItem.itemTypeId === item.itemTypeId && currentItem.count + item.count < 64) {
        return currentItem;
      }
    }
  }
  return null;
};

export default (world: World): System => {
  const dropableItems = world.createSelector([Transform, Item, Inventory]);
  const players = world.createSelector([Transform, Inventory, PlayerData]);
  const dropableSystem = () =>
    players.map(({ id, transform, inventory }) => {
      const item = dropableItems.find(
        ({ transform: { translation } }) => vec3.distance(translation, transform.translation) < 1,
      );
      if (item) {
        const itemData = item.inventory.data;
        let inventorySlot = findItemToAdd(inventory, itemData.items.slot);
        if (!inventorySlot) {
          inventorySlot = createSlot({ count: 0, itemTypeId: itemData.items.slot.itemTypeId, name: '' });
          putItem(inventory.data, inventorySlot);
        }
        inventorySlot.count += 1;
        world.deleteEntity(item.id);
        return [id, transform, inventory];
      }
      return [];
    });
  return dropableSystem;
};
