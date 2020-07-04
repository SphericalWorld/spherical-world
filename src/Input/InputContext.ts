import type { GAME_EVENT_TYPE, GameEvent } from '../../common/GameEvent/GameEvent';
import type { INPUT_TYPE, EVENT_CATEGORY } from './eventTypes';
import type { InputContexts } from './inputContexts';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './eventTypes';
import InputEvent from './InputEvent';
import { STATE_DOWN } from './StateInputEvent';

type MappedEvent = Readonly<{
  action: string;
  type: INPUT_TYPE;
  gameEvent: GAME_EVENT_TYPE;
  data?: (e: InputEvent) => unknown;
  onEnd?: GAME_EVENT_TYPE;
  caption?: string;
  category?: EVENT_CATEGORY;
  dispatchable?: boolean;
}>;

export type InputContext = Readonly<{
  type: InputContexts;
  active: boolean;
  events: Map<string, MappedEvent>;
  eventTypes: Set<MappedEvent>;
}>;

export const createContext = ({
  type,
  active,
  eventTypes,
}: {
  type: InputContexts;
  active: boolean;
  eventTypes: ReadonlyArray<MappedEvent>;
}): InputContext => ({
  type,
  active,
  eventTypes: new Set(eventTypes),
  events: new Map(),
});

export const activate = (context: InputContext) => ({
  ...context,
  active: true,
});
export const deactivate = (context: InputContext) => ({
  ...context,
  active: false,
});

export const getMappedInputEvent = (
  events: Map<string, MappedEvent>,
  inputEvent: InputEvent,
): GameEvent | null => {
  const event = events.get(inputEvent.name);
  if (!event) return null;
  const { type, data, gameEvent, onEnd, dispatchable } = event;
  const payload = data && data(inputEvent);
  switch (type) {
    case INPUT_TYPE_ACTION:
      if (inputEvent.status === STATE_DOWN) {
        return { type: gameEvent, payload, dispatchable };
      }
      return null;
    case INPUT_TYPE_STATE:
      if (inputEvent.status === STATE_DOWN) {
        return { type: gameEvent, payload, dispatchable };
      }
      return { type: onEnd, payload, dispatchable };
    case INPUT_TYPE_RANGE:
      return { type: gameEvent, payload, dispatchable };
    default:
      return null;
  }
};

export const setKey = (context: InputContext, key: string, event: MappedEvent) =>
  context.events.set(key, event);
