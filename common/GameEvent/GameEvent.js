// @flow strict
import type { PLAYER_DESTROYED_BLOCK_TYPE } from '../../src/player/events';
import NetworkSync from '../ecs/components/NetworkSync';

export type GAME_EVENT_TYPE = string;

type SyncEvent = {
  +type: 'SYNC_GAME_DATA',
  +payload: {
    newObjects: $ReadOnlyArray<NetworkSync>,
    components: $ReadOnlyArray<empty>
  },
  +network?: boolean,
}

export type GameEvent =
  | {
    +type: 'GAME_EVENT_TYPE';
    // +payload?: any;
    +network?: boolean;
  }
  | PLAYER_DESTROYED_BLOCK_TYPE
  | SyncEvent
