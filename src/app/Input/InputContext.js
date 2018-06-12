// @flow
import type { GAME_EVENT_TYPE } from '../GameEvent/GameEvent';
import type { INPUT_TYPE } from './events';
import GameEvent from '../GameEvent/GameEvent';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './events';
import InputEvent from './InputEvent';
import { STATE_DOWN, STATE_PRESSED } from './StateInputEvent';

type MappedEvent = {
  +type: INPUT_TYPE,
  +gameEvent: GAME_EVENT_TYPE,
  +data: Object,
};

export default class InputContext {
  active: boolean = false;
  events: Map<string, MappedEvent> = new Map();

  getMappedInputEvent(inputEvent: InputEvent): ?GameEvent {
    const mappedEvent = this.events.get(inputEvent.name);
    if (!mappedEvent) {
      return null;
    }
    switch (mappedEvent.type) {
      case INPUT_TYPE_ACTION:
        if (inputEvent.status === STATE_DOWN) {
          return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
        }
        break;
      case INPUT_TYPE_STATE:
        if (inputEvent.status === STATE_PRESSED) {
          return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
        }
        return new GameEvent(mappedEvent.onEnd, inputEvent, mappedEvent.data);
      case INPUT_TYPE_RANGE:
        return new GameEvent(mappedEvent.gameEvent, inputEvent, mappedEvent.data);
      default:
    }
    return null;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}

export const activate = (context: InputContext) => context.activate();
export const deactivate = (context: InputContext) => context.deactivate();
