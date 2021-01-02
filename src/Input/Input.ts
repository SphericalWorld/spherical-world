import type { InputContext } from './InputContext';
import type { InputContexts } from './inputContexts';
import type { InputEvent } from '../../common/constants/input/eventTypes';
import type InputEvent1 from './InputEvent';
import { activate, deactivate, getMappedInputEvent, setKey as setContextKey } from './InputContext';
import * as events from './events';
import type { MainThreadEvents } from '../Events';
import StateInputEvent from './StateInputEvent';

export type KeyPosition = 'first' | 'second';

export class Input {
  private static contextsMap = new Map<InputContexts, InputContext>();
  private static keyToRebind: InputEvent | null = null;
  private static keyPositionToRebind: KeyPosition | null = null;
  private static onRebind: null | ((key: string) => unknown);

  static contexts: InputContext[] = [];
  static activeContexts: InputContext[];
  static inputStates: Map<string, InputEvent1> = new Map();
  static dispatchHandler: (event: MainThreadEvents) => unknown;
  static keyMappings: Map<InputEvent, { first: string; second: string }> = new Map();

  static setContexts(inputContexts: InputContext[]): void {
    this.contexts = inputContexts;
    for (const context of inputContexts) {
      this.contextsMap.set(context.type, context);
    }
    this.activeContexts = this.getActiveContexts();
  }

  static onEvent(event: InputEvent1): void {
    if (this.keyToRebind && this.keyPositionToRebind) {
      if (event instanceof StateInputEvent) {
        this.setKey(event.name, this.keyToRebind, this.keyPositionToRebind);
        if (this.onRebind) this.onRebind(event.name);

        this.keyToRebind = null;
        this.onRebind = null;
      }
      return;
    }
    for (let i = 0; i < this.activeContexts.length; i += 1) {
      const mappedEvent = getMappedInputEvent(this.activeContexts[i].events, event);
      if (mappedEvent) this.dispatch(mappedEvent);
    }
  }

  static getActiveContexts(): InputContext[] {
    return this.contexts.filter((el) => el.active);
  }

  static switchContext = (activateFn: (context: InputContext) => InputContext) => (
    contextType: InputContexts,
  ): void => {
    const context = Input.contextsMap.get(contextType);
    if (!context) return;
    Input.contextsMap.set(contextType, activateFn(context));
    Input.contexts = [...Input.contextsMap.values()];
    Input.activeContexts = Input.getActiveContexts();
  };

  static activateContext = Input.switchContext(activate);
  static deactivateContext = Input.switchContext(deactivate);

  static dispatch(event: MainThreadEvents): void {
    this.dispatchHandler(event);
  }

  static onDispatch(dispatchHandler: (event: MainThreadEvents) => unknown): void {
    this.dispatchHandler = dispatchHandler;
  }

  static waitForNewKey(
    action: InputEvent,
    keyPositionToRebind: KeyPosition,
    onRebind: (key: string) => unknown,
  ): void {
    this.keyToRebind = action;
    this.keyPositionToRebind = keyPositionToRebind;
    this.onRebind = onRebind;
  }

  static setKey(key: string, actionType: InputEvent, keyPosition: KeyPosition): void {
    const action = Object.values(events).find((e) => e.action === actionType);
    const context = this.contexts.find((el) => el.eventTypes.has(action));
    let mapping = this.keyMappings.get(actionType);
    if (!mapping) {
      mapping = { first: '', second: '' };
      this.keyMappings.set(actionType, mapping);
    }
    mapping[keyPosition] = key;
    if (context) {
      setContextKey(context, key, action);
    }
  }
}
