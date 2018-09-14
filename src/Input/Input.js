// @flow
import type { GameEvent } from '../../common/GameEvent/GameEvent';
import type { InputSource } from './InputSource';
import InputEvent from './InputEvent';
import InputContext, { activate, deactivate } from './InputContext';

const inputProvider = (inputContexts: InputContext[]) => {
  class Input {
    contextsMap: Map<Function, InputContext> = new Map();
    contexts: InputContext[] = [];
    activeContexts: InputContext[];
    inputStates: Map<string, InputEvent> = new Map();
    dispatchHandler: (GameEvent) => void;

    constructor() {
      this.contexts = inputContexts;
      for (const context of inputContexts) {
        this.contextsMap.set(context.constructor, context);
      }
      this.activeContexts = this.getActiveContexts();
    }

    onEvent(event: InputEvent): void {
      for (let i = 0; i < this.activeContexts.length; i += 1) {
        this.activeContexts[i]
          .getMappedInputEvent(event)
          .map(this.dispatch);
      }
    }

    getActiveContexts(): InputContext[] {
      return this.contexts.filter(el => el.active);
    }

    switchContext = (activateFn: Function) => (contextConstructor: Function): void => {
      const context = this.contextsMap.get(contextConstructor);
      if (!context) {
        throw new Error('Context not found');
      }
      activateFn(context);
      this.activeContexts = this.getActiveContexts();
    }

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

export default inputProvider;
