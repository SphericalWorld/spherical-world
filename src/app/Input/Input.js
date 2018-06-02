// @flow
import type GameEvent from '../GameEvent/GameEvent';
import type { InputSource } from './InputSource';
import InputEvent from './InputEvent';
import InputContext from './InputContext';

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
        const gameEvent: ?GameEvent = this.activeContexts[i].getMappedInputEvent(event);
        if (gameEvent) {
          // console.log(gameEvent)
          this.dispatch(gameEvent);
        }
      }
    }

    getActiveContexts(): InputContext[] {
      return this.contexts.filter(el => el.active);
    }

    activateContext(contextConstructor: Function): void {
      const context = this.contextsMap.get(contextConstructor);
      if (!context) {
        throw new Error('Context not found');
      }
      context.activate();
      this.activeContexts = this.getActiveContexts();
    }

    deactivateContext(contextConstructor: Function): void {
      const context = this.contextsMap.get(contextConstructor);
      if (!context) {
        throw new Error('Context not found');
      }
      context.deactivate();
      this.activeContexts = this.getActiveContexts();
    }

    addEventSource(...inputSources: InputSource[]): void {
      for (const inputSource of inputSources) {
        inputSource.onEvent = (event: InputEvent) => this.onEvent(event);
      }
    }

    dispatch(event: GameEvent): void {
      this.dispatchHandler(event);
    }

    onDispatch(dispatchHandler: (GameEvent) => any) {
      this.dispatchHandler = dispatchHandler;
    }
  }

  return Input;
};

/* ::
export const Input = inputProvider([]);
*/

export default inputProvider;
