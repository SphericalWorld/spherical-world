// @flow
import type { GAME_EVENT_TYPE } from '../GameEvent/GameEvent';
import type { INPUT_TYPE } from './events';
import GameEvent from '../GameEvent/GameEvent';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './events';
import InputEvent from './InputEvent';

type MappedEvent = {
  type: INPUT_TYPE,
  gameEvent: GAME_EVENT_TYPE,
}

export default class InputContext {
  active: boolean = false;
  events: Map<string, MappedEvent> = new Map();

  getMappedInputEvent(inputEvent: InputEvent): ?GameEvent {
    const mappedEvent = this.events.get(inputEvent.name);
    if (!mappedEvent) {
      return null;
    }
    // console.log(inputEvent, mappedEvent)
    switch (mappedEvent.type) {
      case INPUT_TYPE_ACTION:
        return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
      case INPUT_TYPE_STATE:
        if (!inputEvent.isEnded) {
          return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
        }
        return new GameEvent(mappedEvent.onEnd, inputEvent, mappedEvent.data);
      case INPUT_TYPE_RANGE:
        return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
      default:
        return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
    }
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
