// @flow
export type GAME_EVENT_TYPE = string;

export type GameEvent = {
  +type: GAME_EVENT_TYPE;
  +payload?: any;
  +network?: boolean;
}
