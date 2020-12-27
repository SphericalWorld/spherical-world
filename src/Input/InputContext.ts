import type { INPUT_TYPE, EVENT_CATEGORY } from './eventTypes';
import type { InputContexts } from './inputContexts';
import { INPUT_TYPE_ACTION, INPUT_TYPE_STATE, INPUT_TYPE_RANGE } from './eventTypes';
import type InputEvent from './InputEvent';
import { STATE_DOWN } from './StateInputEvent';
import type { MainThreadEvents } from '../Events';
import { InputAction } from './InputAction';

export type MappedEvent = Readonly<{
  action: string;
  type: INPUT_TYPE;
  gameEvent: MainThreadEvents['type'];
  data?: (e: InputEvent) => unknown;
  caption?: string;
  category?: EVENT_CATEGORY;
  uiEvent?: never;
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

export const activate = (context: InputContext): InputContext => ({
  ...context,
  active: true,
});
export const deactivate = (context: InputContext): InputContext => ({
  ...context,
  active: false,
});

export const getMappedInputEvent = (
  events: Map<string, MappedEvent>,
  inputEvent: InputEvent,
): MainThreadEvents | null => {
  const event = events.get(inputEvent.name);
  if (!event) return null;
  const { type, data, gameEvent, uiEvent, action } = event;
  const payload = data && data(inputEvent);
  switch (type) {
    case INPUT_TYPE_ACTION:
      if (inputEvent.status === STATE_DOWN) {
        InputAction.dispatch(action);
        return typeof gameEvent !== 'undefined' ? { type: gameEvent, payload, uiEvent } : null;
      }
      return null;
    case INPUT_TYPE_STATE:
      if (inputEvent.status === STATE_DOWN) {
        InputAction.setActive(action, true);
        return { type: gameEvent, payload, uiEvent };
      }
      InputAction.setActive(action, false);
      return null;
    case INPUT_TYPE_RANGE:
      return { type: gameEvent, payload, uiEvent };
    default:
      return null;
  }
};

export const setKey = (context: InputContext, key: string, event: MappedEvent) =>
  context.events.set(key, event);
