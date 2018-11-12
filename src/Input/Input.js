// @flow
import HashMap from '../../common/fp/data-structures/Map';
import type { GameEvent } from '../../common/GameEvent/GameEvent';
import type { InputSource } from './InputSource';
import type { InputContext } from './InputContext';
import InputEvent from './InputEvent';
import {
  activate, deactivate, getMappedInputEvent, setKey as setContextKey,
} from './InputContext';
import * as events from './events';

const inputProvider = (inputContexts: InputContext[]) => {
  class Input {
    contextsMap: HashMap<Function, InputContext> = new HashMap();
    contexts: InputContext[] = [];
    activeContexts: InputContext[];
    inputStates: Map<string, InputEvent> = new Map();
    dispatchHandler: (GameEvent) => void;

    constructor() {
      this.contexts = inputContexts;
      for (const context of inputContexts) {
        this.contextsMap.set(context.type, context);
      }
      this.activeContexts = this.getActiveContexts();
    }

    onEvent(event: InputEvent): void {
      for (let i = 0; i < this.activeContexts.length; i += 1) {
        getMappedInputEvent(this.activeContexts[i].events, event)
          .map(this.dispatch);
      }
    }

    getActiveContexts(): InputContext[] {
      return this.contexts.filter(el => el.active);
    }

    switchContext = (activateFn: Function) => (contextConstructor: Function): void => {
      this.contextsMap
        .get(contextConstructor)
        .map((context) => {
          this.contextsMap.set(contextConstructor, activateFn(context));
          this.contexts = [...this.contextsMap.values()];
          this.activeContexts = this.getActiveContexts();
        });
    };

    activateContext = this.switchContext(activate);
    deactivateContext = this.switchContext(deactivate);

    addEventSource(...inputSources: InputSource[]): void {
      for (const inputSource of inputSources) {
        inputSource.onEvent = (event: InputEvent) => this.onEvent(event);
      }
    }

    dispatch = (event: GameEvent): void => {
      this.dispatchHandler(event);
    }

    onDispatch(dispatchHandler: (GameEvent) => any) {
      this.dispatchHandler = dispatchHandler;
    }
  }

  return Input;
};

declare var tmp: $Call<typeof inputProvider, InputContext[]>;
export type Input = tmp;

export const setKey = (input: Input, key, actionType) => {
  const action = events[Object.keys(events).find(e => e === actionType)];
  const context = input.contexts.find(el => el.eventTypes.has(action));
  if (context) {
    setContextKey(context, key, action);
  }
};

export default inputProvider;
