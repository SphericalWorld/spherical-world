import type { EventTypes } from './constants/input/eventTypes';
import type { Slot } from './Inventory';

export enum ServerToClientMessage {
  syncGameData,
  gameStart,
  loggedIn,
  loadControlSettings,
  loadChunk,
  unloadChunk,
  chatMessage,
  playerAddItem,
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
  | Readonly<{ type: ServerToClientMessage.loggedIn; data: Readonly<{ id: string }> }>
  | Readonly<{
      type: ServerToClientMessage.loadControlSettings;
      data: { controls: [[EventTypes, unknown, unknown]] };
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
      data: Slot;
    }>;

export enum ClientToServerMessage {
  syncGameData = 1000, // to have no overlap
  login,
  ping,
  playerStartedDestroyingBlock,
  playerDestroyedBlock,
  chatMessage,
}

export type ClientToServerMessages =
  | Readonly<{
      type: ClientToServerMessage.syncGameData;
      data: {
        components?: never[];
        newObjects?: never[];
        deletedObjects?: never[];
      };
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
      type: ClientToServerMessage.chatMessage;
      data: string;
    }>;
