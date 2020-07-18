import { Component } from './Component';

export const BYTE = 1;
export const UINT16 = 2;
export const UINT32 = 4;
export const FLOAT32 = 4;
export const VEC_FLOAT32 = 12;
export const VEC2 = 8;
export const VEC3 = VEC_FLOAT32;
export const MAT4 = 64;

const MEMORY_ADRESS_SIZE = 4;
const FREE_BLOCK_POINTER = 0;
const DESCRIPTOR_SIZE = MEMORY_ADRESS_SIZE;

const getMemOffset = (address: number): number => (address / MEMORY_ADRESS_SIZE) | 0;

const compareAndSwap = (
  memory: Uint32Array,
  index: number,
  expectedValue: number,
  replacementValue: number,
): boolean => {
  Atomics.compareExchange(memory, index, expectedValue, replacementValue);
  return Atomics.load(memory, index) === expectedValue;
};

export class ConcurrentLinkedList {
  readonly memory: SharedArrayBuffer;
  readonly descriptor: Uint32Array;
  readonly view: DataView;
  readonly elementSize: number;

  constructor(memory: SharedArrayBuffer, elementSize: number) {
    if (elementSize % MEMORY_ADRESS_SIZE) {
      throw new Error(`Element size must be a multiply of ${MEMORY_ADRESS_SIZE}`);
    }
    this.memory = memory;
    this.elementSize = DESCRIPTOR_SIZE + elementSize;
    this.descriptor = new Uint32Array(memory);
    this.view = new DataView(memory);
  }

  allocateNode(): number {
    const { descriptor, elementSize } = this;
    const currentFreeElementPointer = Atomics.add(descriptor, FREE_BLOCK_POINTER, elementSize);
    return currentFreeElementPointer + elementSize;
  }

  insertNodeAfter(elPointerBytes: number): number {
    const { descriptor } = this;
    const newElementPointer = this.allocateNode();
    const currentElementMemOffset = getMemOffset(elPointerBytes);
    let didInsertSuccessful = true;
    do {
      const currentElementPointerToNext = Atomics.load(descriptor, currentElementMemOffset);
      this.view.setUint32(newElementPointer, currentElementPointerToNext);
      didInsertSuccessful = compareAndSwap(
        descriptor,
        currentElementMemOffset,
        currentElementPointerToNext,
        newElementPointer,
      );
    } while (!didInsertSuccessful);
    return newElementPointer;
  }
}

type Memory = {
  [componentName: string]: { data: SharedArrayBuffer; offsetPointer: Uint32Array };
};

export class MemoryManager {
  private memory: Memory = {};

  currentComponentLocalOffset = 0;
  currentComponentMemory: SharedArrayBuffer = new SharedArrayBuffer(0);

  registerComponentType(component: Component): void {
    const data = new SharedArrayBuffer(1024 * 1024 * 10);
    const offsetPointer = new Uint32Array(data, 0, 1);
    offsetPointer[0] = 4;
    this.memory[component.componentName] = {
      data,
      offsetPointer,
    };
  }

  useMemory(memory: Memory): void {
    this.memory = Object.fromEntries(
      Object.entries({ ...memory }).map(([componentName, value]) => [
        componentName,
        { data: value.data, offsetPointer: new Uint32Array(value.data, 0, 1) },
      ]),
    );
  }

  allocate(component: Component): number {
    const { offsetPointer } = this.memory[component.componentName];
    const normalizedSize = Math.ceil(component.memorySize / 4) * 4;
    const offset = Atomics.add(offsetPointer, 0, normalizedSize);
    this.currentComponentLocalOffset = offset;
    this.currentComponentMemory = this.memory[component.componentName].data;

    return offset;
  }

  useAlocatedMemory(offset: number, component: Component): void {
    this.currentComponentLocalOffset = offset;
    this.currentComponentMemory = this.memory[component.componentName].data;
  }

  getVec2(): Float32Array {
    const res = new Float32Array(this.currentComponentMemory, this.currentComponentLocalOffset, 2);
    this.currentComponentLocalOffset += 4 * 2;
    return res;
  }

  getVec3(): Float32Array {
    const res = new Float32Array(this.currentComponentMemory, this.currentComponentLocalOffset, 3);
    this.currentComponentLocalOffset += 4 * 3;
    return res;
  }

  getQuat(): Float32Array {
    const res = new Float32Array(this.currentComponentMemory, this.currentComponentLocalOffset, 4);
    this.currentComponentLocalOffset += 4 * 4;
    return res;
  }

  getMat4(): Float32Array {
    const res = new Float32Array(this.currentComponentMemory, this.currentComponentLocalOffset, 16);
    this.currentComponentLocalOffset += 4 * 16;
    return res;
  }

  getDataView(size: number): DataView {
    const normalizedSize = Math.ceil(size / 4) * 4;
    const res = new DataView(
      this.currentComponentMemory,
      this.currentComponentLocalOffset,
      normalizedSize,
    );
    this.currentComponentLocalOffset += normalizedSize;
    return res;
  }

  // eslint-disable-next-line class-methods-use-this
  getUint8(): number {
    throw new Error('This method is a placeholder for babel plugin, you cant invoke it directly');
  }

  // eslint-disable-next-line class-methods-use-this
  getUint16(): number {
    throw new Error('This method is a placeholder for babel plugin, you cant invoke it directly');
  }

  // eslint-disable-next-line class-methods-use-this
  getUint32(): number {
    throw new Error('This method is a placeholder for babel plugin, you cant invoke it directly');
  }

  // eslint-disable-next-line class-methods-use-this
  getFloat32(): number {
    throw new Error('This method is a placeholder for babel plugin, you cant invoke it directly');
  }
}
