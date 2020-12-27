import type { World } from '../common/ecs';
import type { Slot } from '../common/Inventory';

export enum GameEvent {
  cameraMoved,
  updateComponents,
  chunkLoaded,
  playerDestroyedBlock,
  playerPutBlock,
  playerTriedPutBlock,
  setDayTime,
  chunkVBOLoaded,
  previousItemSelected,
  nextItemSelected,
  itemSelected,
  playerCraftAttempt,
}

type ChunkLoadedEvent = Readonly<{
  type: GameEvent.chunkLoaded;
  payload: Readonly<{
    x: number;
    z: number;
    data: SharedArrayBuffer;
    lightData: SharedArrayBuffer;
    flagsData: SharedArrayBuffer;
  }>;
}>;

type ChunkVBOLoaded = Readonly<{
  type: GameEvent.chunkVBOLoaded;
  payload: {
    geoId: string;
    subchunk: number;
    buffers: {
      vertexBuffer: ArrayBuffer;
      indexBuffer: ArrayBuffer;
    };
    hasData: boolean;
    buffersInfo: Array<{ indexCount: number; index: number; offset: number }>;
  };
}>;

type PlayerPutBlock = Readonly<{
  type: GameEvent.playerPutBlock;
  payload: {
    geoId: string;
    positionInChunk: [number, number, number];
    blockId: number;
    flags: number;
    itemId: string;
  };
}>;

export type MainThreadEvents =
  | Readonly<{
      type: GameEvent.cameraMoved;
      payload: {
        x: number;
        y: number;
      };
    }>
  | Readonly<{
      type: GameEvent.playerTriedPutBlock;
    }>
  | ChunkLoadedEvent
  | Readonly<{
      type: GameEvent.setDayTime;
      payload: string;
    }>
  | PlayerPutBlock
  | ChunkVBOLoaded
  | Readonly<{
      type: GameEvent.itemSelected;
      payload: Slot | null;
    }>
  | Readonly<{
      type: GameEvent.playerCraftAttempt;
      payload: {
        amount: number;
        recipeId: string;
      };
    }>;

export type PhysicsThreadEvents = ChunkLoadedEvent;

export type ChunkHandlerThreadEvents =
  | Readonly<{
      type: GameEvent.updateComponents;
    }>
  | ChunkLoadedEvent
  | Readonly<{
      type: GameEvent.playerDestroyedBlock;
      payload: {
        geoId: string;
        positionInChunk: [number, number, number];
      };
    }>
  | PlayerPutBlock
  | ChunkVBOLoaded;

export type WorldMainThread = World<MainThreadEvents>;
export type WorldPhysicsThread = World<PhysicsThreadEvents>;
