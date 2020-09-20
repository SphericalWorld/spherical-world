import { vec3 } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import { Transform, Item, Inventory, PlayerData } from '../components';
import { createSlot, putItem, Slot, findItemToAdd } from '../../common/Inventory';
import type { DataStorage } from '../dataStorage';
import { updateGameObject, getAllGameObjects, deleteGameObject } from '../dataStorage';
import { throttle } from '../../common/utils';
import { deserializeItem } from '../item';
import { ServerToClientMessage } from '../../common/protocol';

export default (world: World, ds: DataStorage): System => {
  const dropableItems = world.createSelector([Transform, Item, Inventory]);
  const players = world.createSelector([Transform, Inventory, PlayerData]);
  const syncData = throttle(() => {
    updateGameObject(ds, 'dropableItems')(...dropableItems);
  }, 2000);
  const deleteItem = deleteGameObject(ds, 'dropableItems');

  getAllGameObjects(ds, 'dropableItems')().then((items) => items.forEach(deserializeItem(world)));

  const dropableSystem = () => {
    syncData();
    return players.map(({ id, transform, inventory }) => {
      const item = dropableItems.find(
        ({ transform: { translation } }) => vec3.distance(translation, transform.translation) < 1,
      );
      if (item) {
        const itemData = item.inventory.data;
        let inventorySlot = findItemToAdd(inventory, itemData.items.slot);
        if (!inventorySlot) {
          inventorySlot = createSlot({
            count: 0,
            itemTypeId: itemData.items.slot.itemTypeId,
          });
          putItem(inventory.data, inventorySlot);
        }
        inventorySlot.count += 1;
        world.deleteEntity(item.id);
        world.pushToNetworkQueue({
          id,
          payload: { type: ServerToClientMessage.playerAddItem, data: inventorySlot },
        });
        deleteItem(item.id);
      }
    });
  };
  return dropableSystem;
};
