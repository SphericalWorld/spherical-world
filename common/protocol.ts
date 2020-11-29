import type { TransformProps } from './ecs/components/Transform';
import type { EventTypes } from './constants/input/eventTypes';
import type { InputRawEvents } from './constants/input/rawEvents';
import type { Slot } from './Inventory';
import type { SlotInfo } from './Inventory/Inventory';
import type { InventoryProps } from './ecs/components/Inventory';
import type { PlayerData } from '../server/components';
import type { CameraProps } from './ecs/components/Camera';

export enum ServerToClientMessage {
  syncGameData,
  gameStart,
  loggedIn,
  loadControlSettings,
  loadChunk,
  unloadChunk,
  chatMessage,
  playerAddItem,
  playerPutBlock,
}

export type ServerToClientMessages =
  | Readonly<{
      type: ServerToClientMessage.syncGameData;
      data: {
        components?: never[];
        newObjects?: never[];
        deletedObjects?: string[];
      };
    }>
  | Readonly<{ type: ServerToClientMessage.gameStart }>
  | Readonly<{
      type: ServerToClientMessage.loggedIn;
      data: Readonly<{
        id: string;
        transform: TransformProps;
        inventory: InventoryProps;
        playerData: PlayerData;
        camera: CameraProps;
      }>;
    }>
  | Readonly<{
      type: ServerToClientMessage.loadControlSettings;
      data: { controls: ReadonlyArray<[EventTypes, InputRawEvents, InputRawEvents]> };
    }>
  | Readonly<{
      type: ServerToClientMessage.loadChunk;
      binaryData: ArrayBuffer;
      data: Readonly<{
        x: number;
        z: number;
        rainfall: number[];
        temperature: number[];
      }>;
    }>
  | Readonly<{
      type: ServerToClientMessage.unloadChunk;
      data: Readonly<{
        x: number;
        z: number;
      }>;
    }>
  | Readonly<{
      type: ServerToClientMessage.chatMessage;
      data: {
        id: string;
        text: string;
        time: number;
        from: {
          id: string;
          name: string;
        };
      };
    }>
  | Readonly<{
      type: ServerToClientMessage.playerAddItem;
      data: Readonly<SlotInfo>;
    }>
  | Readonly<{
      type: ServerToClientMessage.playerPutBlock;
      data: Readonly<{
        flags: number;
        geoId: string;
        positionInChunk: [number, number, number];
        position: [number, number, number];
        blockId: number;
        itemId: string;
      }>;
    }>;

export enum ClientToServerMessage {
  syncGameData,
  login,
  ping,
  playerStartedDestroyingBlock,
  playerDestroyedBlock,
  playerPutBlock,
  chatMessage,
  playerCraftAttempt,
}

export type ClientToServerMessages =
  | Readonly<{
      type: ClientToServerMessage.syncGameData;
      data: [{ type: never; data: never[] }];
    }>
  | Readonly<{
      type: ClientToServerMessage.login;
      data: Readonly<{ cookie: string; userId: string }>;
    }>
  | Readonly<{
      type: ClientToServerMessage.ping;
    }>
  | Readonly<{
      type: ClientToServerMessage.playerStartedDestroyingBlock;
      data: [number, number, number];
    }>
  | Readonly<{
      type: ClientToServerMessage.playerDestroyedBlock;
      data: Readonly<{
        geoId: string;
        positionInChunk: [number, number, number];
        position: [number, number, number];
      }>;
    }>
  | Readonly<{
      type: ClientToServerMessage.playerPutBlock;
      data: Readonly<{
        flags: number;
        geoId: string;
        positionInChunk: [number, number, number];
        position: [number, number, number];
        blockId: number;
        itemId: string;
      }>;
    }>
  | Readonly<{
      type: ClientToServerMessage.chatMessage;
      data: string;
    }>
  | Readonly<{
      type: ClientToServerMessage.playerCraftAttempt;
      data: {
        amount: number;
        recipeId: string;
      };
    }>;
