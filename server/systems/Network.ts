import type { World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';
import type { DataStorage } from '../dataStorage';

import { broadcastToLinked, send, Socket } from '../network/socket';
import { Transform, Network, Inventory } from '../components';
import defaultInputBindings from '../../common/constants/input/defaultInputBindings';
import { saveGameObject, getGameObject } from '../dataStorage';
import { ServerToClientMessage, ClientToServerMessage } from '../../common/protocol';
import { craftRecipes as recipes } from '../../common/craft/recipes';
import type { Slot, Inventory as InventoryData } from '../../common/Inventory';
import { findItemToAdd } from './Dropable';
import { createSlot, putItem, deleteItem } from '../../common/Inventory';

//-----
const isNessesaryAmountItemInInventory = (
  item: { ingredientId: number; amount: number },
  inventoryItems: Record<string, Slot>,
) => {
  const inventoryItemsArray = Object.values(inventoryItems);
  const amountInInventory = inventoryItemsArray.reduce((acc, inventoryItem) => {
    if (inventoryItem.itemTypeId === item.ingredientId) {
      acc += inventoryItem.count;
      return acc;
    }
    return acc;
  }, 0);
  return amountInInventory >= item.amount;
};

const canCraft = (
  ingredientsAmountArray: ReadonlyArray<{ ingredientId: number; amount: number }>,
  inventoryItems: Record<string, Slot>,
) => {
  return ingredientsAmountArray.every((ingredientAmount) =>
    isNessesaryAmountItemInInventory(ingredientAmount, inventoryItems),
  );
};

export const findItemSlot = (inventory: InventoryData, itemId: number) => {
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
  inventory: InventoryData,
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
      deleteItem(inventory, slotToDecrease);
      return amount - slotToDecrease.count;
    }
    if (slotToDecrease.count === amount) {
      deleteItem(inventory, slotToDecrease);
      return 0;
    }
  }
  return 0;
};
//-----

const onSyncGameData = (server: Server, world: World) =>
  server.events
    .filter((e) => e.type === ClientToServerMessage.syncGameData && e)
    .subscribe(({ data }) => {
      world.updateComponents(data);
    });

const onPlayerPutBlock = (server: Server) =>
  server.events
    .filter((e) => e.type === ClientToServerMessage.playerPutBlock && e)
    .subscribe(({ socket, data }) => {
      broadcastToLinked(socket.player, ServerToClientMessage.playerPutBlock, data);
      socket.player.inventory.data.items[data.itemId].count -= 1;
      server.terrain.putBlockHandler(data);
    });

const onPlayerDestroyedBlock = (server: Server, ds: DataStorage) =>
  server.events
    .filter((e) => e.type === ClientToServerMessage.playerDestroyedBlock && e)
    .subscribe(({ socket, data }) => {
      broadcastToLinked(socket.player, 'PLAYER_DESTROYED_BLOCK', data);
      saveGameObject(ds, 'dropableItems')(server.terrain.removeBlockHandler(data));
    });

const onPlayerCraftAttempt = (server: Server, ds: DataStorage, world: World) =>
  server.events
    .filter((e) => e.type === ClientToServerMessage.playerCraftAttempt && e)
    .subscribe(({ socket, data }) => {
      // console.log('12222;', data, socket.player.inventory.data);

      const recipe = recipes[data.recipeId];
      const ingredientsAmount = recipe.ingredients.map((ingredient) => {
        return { ingredientId: ingredient.id, amount: ingredient.count * data.amount };
      });
      if (canCraft(ingredientsAmount, socket.player.inventory.data.items)) {
        ingredientsAmount.map((ingredient) => {
          let diff = decreaseItemAmount(
            socket.player.inventory.data,
            ingredient.ingredientId,
            ingredient.amount,
          );
          do {
            diff = decreaseItemAmount(socket.player.inventory.data, ingredient.ingredientId, diff);
          } while (diff !== 0);
        });

        let inventorySlot = findItemToAdd(socket.player.inventory, {
          count: data.amount * recipe.count,
          itemTypeId: recipe.itemId,
        });
        if (!inventorySlot) {
          inventorySlot = createSlot({
            count: 0,
            itemTypeId: recipe.itemId,
          });
          putItem(socket.player.inventory.data, inventorySlot);
        }
        inventorySlot.count += data.amount * recipe.count;

        world.pushToNetworkqueue({
          id: socket.player.id,
          payload: { type: ServerToClientMessage.playerAddItem, data: inventorySlot },
        });
      }
    });

const registerNewPlayer = (ds: DataStorage, createPlayer: CreatePlayer) => async (
  socket: Socket,
) => {
  const player = createPlayer(null, socket);
  await saveGameObject(ds)(player);
  return player;
};

const getPlayer = (ds: DataStorage, createPlayer: CreatePlayer) => async (
  socket: Socket,
  userId: string,
) => {
  const playerData = await getGameObject(ds)(userId);
  const player = createPlayer(playerData, socket);
  return player;
};

const RENDER_DISTANCE = 8;
const VISIBILITY = RENDER_DISTANCE + 2; // 1 chunk around will have loaded lights but not vbo, and another 1 will have no lights loaded

const sendChunks = (server: Server, player) => {
  const [x, , z] = player.transform.translation;
  const {
    network: { socket },
  } = player;
  const flooredX = Math.floor(x / 16);
  const flooredZ = Math.floor(z / 16);

  server.terrain.sendChunk({ socket }, flooredX * 16, flooredZ * 16);
  for (let distance = 1; distance < VISIBILITY + 1; distance += 1) {
    for (let i = -distance; i < distance + 1; i += 1) {
      server.terrain.sendChunk({ socket }, (i + flooredX) * 16, (distance + flooredZ) * 16);
    }
    for (let i = distance - 1; i > -distance; i -= 1) {
      server.terrain.sendChunk({ socket }, (distance + flooredX) * 16, (i + flooredZ) * 16);
    }
    for (let i = distance; i > -distance - 1; i -= 1) {
      server.terrain.sendChunk({ socket }, (i + flooredX) * 16, (-distance + flooredZ) * 16);
    }
    for (let i = -distance + 1; i < distance; i += 1) {
      server.terrain.sendChunk({ socket }, (-distance + flooredX) * 16, (i + flooredZ) * 16);
    }
  }
};

const serialize = ({ id, ...data }) =>
  Object.assign(
    { id },
    ...Object.entries(data)
      .filter(([, value]) => value.constructor.networkable)
      .map(([key, value]) => ({ [key]: value })),
  );

const onLogin = (server: Server, ds: DataStorage, createPlayer: CreatePlayer, players, world) =>
  server.events
    .filter((e) => e.type === ClientToServerMessage.login && e)
    .subscribe(async ({ socket, data }) => {
      // data.cookie
      const player = data.userId
        ? await getPlayer(ds, createPlayer)(socket, data.userId)
        : await registerNewPlayer(ds, createPlayer)(socket);

      const { id, transform, playerData, inventory, camera } = player;
      // player.terrain = this.server.terrain;
      for (const otherPlayer of players) {
        if (id !== otherPlayer.id) {
          player.network.linkedPlayers.push(otherPlayer);
          otherPlayer.network.linkedPlayers.push(player);
        }
      }
      sendChunks(server, player);
      send(socket, {
        type: ServerToClientMessage.syncGameData,
        data: {
          newObjects: [...world.objects.values()]
            .filter((el) => el.networkSync && el.id !== id)
            .map(serialize),
        },
      });
      send(socket, {
        type: ServerToClientMessage.loggedIn,
        data: {
          id,
          transform,
          playerData,
          inventory,
          camera,
        },
      });
      send(socket, {
        type: ServerToClientMessage.loadControlSettings,
        data: {
          controls: defaultInputBindings,
        },
      });
      send(socket, { type: ServerToClientMessage.gameStart });
    });

export default (
  world: World,
  server: Server,
  ds: DataStorage,
  createPlayer: CreatePlayer,
): System => {
  const players = world.createSelector([Transform, Network, Inventory]);

  onSyncGameData(server, world);
  onPlayerPutBlock(server);
  onPlayerDestroyedBlock(server, ds);
  onLogin(server, ds, createPlayer, players, world);
  onPlayerCraftAttempt(server, ds, world);

  const networkSystem = () => {};
  return networkSystem;
};
