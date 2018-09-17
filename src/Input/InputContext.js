// @flow
import type { Maybe } from '../../common/fp/monads/maybe';
import type { GAME_EVENT_TYPE, GameEvent } from '../../common/GameEvent/GameEvent';
import type { INPUT_TYPE, EVENT_CATEGORY } from './eventTypes';
import HashMap from '../../common/fp/data-structures/Map';
import { Just, Nothing } from '../../common/fp/monads/maybe';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './eventTypes';
import InputEvent from './InputEvent';
import { STATE_DOWN } from './StateInputEvent';

type MappedEvent = {|
  +type: INPUT_TYPE,
  +gameEvent: GAME_EVENT_TYPE,
  +data?: InputEvent => Object,
  +onEnd?: GAME_EVENT_TYPE,
  +caption?: string,
  +category?: EVENT_CATEGORY
|};

export default class InputContext {
  active: boolean = false;
  events: HashMap<string, MappedEvent> = new HashMap();

  getMappedInputEvent(inputEvent: InputEvent): Maybe<GameEvent> {
    return this.events
      .get(inputEvent.name)
      .chain(({
        type, data, gameEvent, onEnd,
      }: MappedEvent) => {
        const payload = data && data(inputEvent);
        switch (type) {
          case INPUT_TYPE_ACTION:
            if (inputEvent.status === STATE_DOWN) {
              return Just({ type: gameEvent, payload });
            }
            return Nothing;
          case INPUT_TYPE_STATE:
            if (inputEvent.status === STATE_DOWN) {
              return Just({ type: gameEvent, payload });
            }
            return Just({ type: onEnd, payload });
          case INPUT_TYPE_RANGE:
            return Just({ type: gameEvent, payload });
          default:
            return Nothing;
        }
      });
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
