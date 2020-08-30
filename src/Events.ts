import type { World } from '../common/ecs';

export enum GameEvent {
  cameraLocked,
  cameraUnlocked,
  cameraMoved,
  inventoryToggled,
  menuToggled,
  playerMoved,
  playerStopedMove,
  playerJumped,
  playerStopedJump,
  playerRun,
  playerStopedRun,
  updateComponents,
  chunkLoaded,
  playerDestroyedBlock,
  playerPutBlock,
  playerTriedPutBlock,
  playerAttacked,
  playerStopedAttack,
  setDayTime,
  chunkVBOLoaded,
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

export type MainThreadEvents =
  | Readonly<{
      type: GameEvent.cameraLocked;
    }>
  | Readonly<{
      type: GameEvent.cameraUnlocked;
    }>
  | Readonly<{
      type: GameEvent.cameraMoved;
      payload: {
        x: number;
        y: number;
      };
    }>
  | Readonly<{
      type: GameEvent.inventoryToggled;
    }>
  | Readonly<{
      type: GameEvent.menuToggled;
    }>
  | Readonly<{
      type: GameEvent.playerTriedPutBlock;
    }>
  | ChunkLoadedEvent
  | Readonly<{
      type: GameEvent.playerAttacked;
    }>
  | Readonly<{
      type: GameEvent.playerStopedAttack;
    }>
  | Readonly<{
      type: GameEvent.setDayTime;
      payload: string;
    }>
  | ChunkVBOLoaded;

export type PhysicsThreadEvents =
  | Readonly<{
      type: GameEvent.playerMoved;
    }>
  | Readonly<{
      type: GameEvent.playerStopedMove;
    }>
  | Readonly<{
      type: GameEvent.playerJumped;
    }>
  | Readonly<{
      type: GameEvent.playerStopedJump;
    }>
  | Readonly<{
      type: GameEvent.playerRun;
    }>
  | Readonly<{
      type: GameEvent.playerStopedRun;
    }>
  | ChunkLoadedEvent;

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
  | Readonly<{
      type: GameEvent.playerPutBlock;
    }>
  | ChunkVBOLoaded;

export type WorldMainThread = World<MainThreadEvents>;
export type WorldPhysicsThread = World<PhysicsThreadEvents>;
