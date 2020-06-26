import type { PLAYER_DESTROYED_BLOCK_TYPE } from '../../src/player/events';
import NetworkSync from '../ecs/components/NetworkSync';

export type GAME_EVENT_TYPE = string;

type SyncEvent = Readonly<{
  type: 'SYNC_GAME_DATA',
  payload: {
    newObjects: ReadonlyArray<NetworkSync>,
    components: ReadonlyArray<never>
  },
  network?: boolean,
  dispatchable: boolean;
}>

export type GameEvent =
  | Readonly<{
    type: 'GAME_EVENT_TYPE';
    // +payload?: any;
    network?: boolean;
    dispatchable: boolean;
  }>
  | PLAYER_DESTROYED_BLOCK_TYPE
  | SyncEvent
