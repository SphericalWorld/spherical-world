// @flow
import type { PLAYER_DESTROYED_BLOCK_TYPE } from '../player/events';

export type GAME_EVENT_TYPE = string;

export type GameEvent = {
  +type: 'GAME_EVENT_TYPE';
  // +payload?: any;
  +network?: boolean;
} | PLAYER_DESTROYED_BLOCK_TYPE
