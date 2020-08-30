import type { GameEvent1 } from '../../common/GameEvent/GameEvent';
import type { InputSource } from './InputSource';
import type { InputContext } from './InputContext';
import type { InputContexts } from './inputContexts';
import type { EventTypes } from '../../common/constants/input/eventTypes';
import type InputEvent from './InputEvent';
import { activate, deactivate, getMappedInputEvent, setKey as setContextKey } from './InputContext';
import * as events from './events';

const inputProvider = (inputContexts: InputContext[]) => {
  class Input {
    private contextsMap = new Map<InputContexts, InputContext>();
    contexts: InputContext[] = [];
    activeContexts: InputContext[];
    inputStates: Map<string, InputEvent> = new Map();
    dispatchHandler: (event: GameEvent1) => unknown;

    constructor() {
      this.contexts = inputContexts;
      for (const context of inputContexts) {
        this.contextsMap.set(context.type, context);
      }
      this.activeContexts = this.getActiveContexts();
    }

    onEvent(event: InputEvent): void {
      for (let i = 0; i < this.activeContexts.length; i += 1) {
        const mappedEvent = getMappedInputEvent(this.activeContexts[i].events, event);
        if (mappedEvent) this.dispatch(mappedEvent);
      }
    }

    getActiveContexts(): InputContext[] {
      return this.contexts.filter((el) => el.active);
    }

    switchContext = (activateFn: (context: InputContext) => InputContext) => (
      contextType: InputContexts,
    ): void => {
      const context = this.contextsMap.get(contextType);
      if (!context) return;
      this.contextsMap.set(contextType, activateFn(context));
      this.contexts = [...this.contextsMap.values()];
      this.activeContexts = this.getActiveContexts();
    };

    activateContext = this.switchContext(activate);
    deactivateContext = this.switchContext(deactivate);

    addEventSource(...inputSources: InputSource[]): void {
      for (const inputSource of inputSources) {
        inputSource.onEvent = (event: InputEvent) => this.onEvent(event);
      }
    }

    dispatch = (event: GameEvent1): void => {
      this.dispatchHandler(event);
    };

    onDispatch(dispatchHandler: (event: GameEvent1) => unknown) {
      this.dispatchHandler = dispatchHandler;
    }
  }

  return Input;
};

export type Input = InstanceType<ReturnType<typeof inputProvider>>;

export const setKey = (input: Input, key: string, actionType: EventTypes) => {
  const action = Object.values(events).find((e) => e.action === actionType);
  const context = input.contexts.find((el) => el.eventTypes.has(action));
  if (context) {
    setContextKey(context, key, action);
  }
};

export default inputProvider;
