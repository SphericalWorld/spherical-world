import { InputEvent } from '../../common/constants/input/eventTypes';

export class InputAction {
  private static memory: SharedArrayBuffer = new SharedArrayBuffer(0);
  private static memoryMapping: Int32Array = new Int32Array(0);
  private static actionHandlersMap: Array<Set<() => unknown>> = new Array(InputEvent.ELEMENTS_COUNT)
    .fill(0)
    .map(() => new Set());

  static isActive(event: InputEvent): boolean {
    return !!this.memoryMapping[event];
  }

  static setActive(event: InputEvent, isActive: boolean): void {
    this.memoryMapping[event] = isActive ? 1 : 0;
  }

  static setMemory(memory: SharedArrayBuffer): void {
    this.memory = memory;
    this.memoryMapping = new Int32Array(this.memory);
  }

  static getMemory(): SharedArrayBuffer {
    return this.memory;
  }

  static on(event: InputEvent, callback: () => unknown): void {
    this.actionHandlersMap[event].add(callback);
  }

  static dispatch(event: InputEvent): void {
    for (const handler of this.actionHandlersMap[event]) {
      handler();
    }
  }
}
