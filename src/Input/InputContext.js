// @flow strict
import type { Maybe } from '../../common/fp/monads/maybe';
import type { GAME_EVENT_TYPE, GameEvent } from '../../common/GameEvent/GameEvent';
import type { INPUT_TYPE, EVENT_CATEGORY } from './eventTypes';
import type { InputContexts } from './inputContexts';
import HashMap from '../../common/fp/data-structures/Map';
import { Just, Nothing } from '../../common/fp/monads/maybe';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './eventTypes';
import InputEvent from './InputEvent';
import { STATE_DOWN } from './StateInputEvent';

type MappedEvent = {|
  +action: string,
  +type: INPUT_TYPE,
  +gameEvent: GAME_EVENT_TYPE,
  +data?: InputEvent => mixed,
  +onEnd?: GAME_EVENT_TYPE,
  +caption?: string,
  +category?: EVENT_CATEGORY,
  +dispatchable?: boolean,
|};

export type InputContext = {|
  +type: InputContexts,
  +active: boolean;
  +events: HashMap<string, MappedEvent>;
  +eventTypes: Set<MappedEvent>,
|}

export const createContext = ({ type, active, eventTypes }: {|
  type: InputContexts,
  active: boolean,
  eventTypes: $ReadOnlyArray<MappedEvent>
|}): InputContext => ({
  type,
  active,
  eventTypes: new Set(eventTypes),
  events: new HashMap(),
});

export const activate = (context: InputContext) => ({ ...context, active: true });
export const deactivate = (context: InputContext) => ({ ...context, active: false });

export const getMappedInputEvent = (events: HashMap<string, MappedEvent>, inputEvent: InputEvent): Maybe<GameEvent> => events
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

export const setKey = (context: InputContext, key, event: MappedEvent) =>
  context.events.set(key, event);
