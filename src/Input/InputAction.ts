import type { InputEvent } from '../../common/constants/input/eventTypes';

export class InputAction {
  private static memory: SharedArrayBuffer = new SharedArrayBuffer(0);
  private static memoryMapping: Int32Array = new Int32Array(0);

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
}
