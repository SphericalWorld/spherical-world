// @flow
export type GAME_EVENT_TYPE = string;

export default class GameEvent {
  type: GAME_EVENT_TYPE;
  data: Object;
  inputEvent: Object;

  constructor(type: GAME_EVENT_TYPE, inputEvent: Object, data: Object) {
    this.type = type;
    this.data = data;
    this.inputEvent = inputEvent;
  }
}
