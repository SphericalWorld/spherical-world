export class MemoryManager {
  // private memory: { [componentName: string]: ArrayBuffer } = {};
  memory: SharedArrayBuffer;
  offsetPointer: Uint32Array;
  currentComponentLocalOffset = 0;

  constructor() {
    this.memory = new SharedArrayBuffer(1024 * 1024 * 10);
    this.offsetPointer = new Uint32Array(this.memory, 0, 1);
    this.offsetPointer[0] = 4;
  }

  allocate(component): number {
    const offset = Atomics.add(this.offsetPointer, 0, component.memorySize);
    this.currentComponentLocalOffset = offset;

    return offset;
  }

  useAlocatedMemory(offset: number): void {
    this.currentComponentLocalOffset = offset;
  }

  getVec3(): Float32Array {
    const res = new Float32Array(this.memory, this.currentComponentLocalOffset, 3);
    this.currentComponentLocalOffset += 4 * 3;
    return res;
  }

  getQuat(): Float32Array {
    const res = new Float32Array(this.memory, this.currentComponentLocalOffset, 4);
    this.currentComponentLocalOffset += 4 * 4;
    return res;
  }
}
