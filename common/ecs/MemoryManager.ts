export const BYTE = 1;
export const UINT16 = 2;
export const UINT32 = 4;
export const FLOAT32 = 4;
export const VEC_FLOAT32 = 12;
export const VEC2 = 8;
export const VEC3 = VEC_FLOAT32;
export const MAT4 = 64;

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
    const normalizedSize = Math.ceil(component.memorySize / 4) * 4;
    const offset = Atomics.add(this.offsetPointer, 0, normalizedSize);
    this.currentComponentLocalOffset = offset;

    return offset;
  }

  useAlocatedMemory(offset: number): void {
    this.currentComponentLocalOffset = offset;
  }

  getVec2(): Float32Array {
    const res = new Float32Array(this.memory, this.currentComponentLocalOffset, 2);
    this.currentComponentLocalOffset += 4 * 2;
    return res;
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

  getMat4(): Float32Array {
    const res = new Float32Array(this.memory, this.currentComponentLocalOffset, 16);
    this.currentComponentLocalOffset += 4 * 16;
    return res;
  }

  getDataView(size: number): DataView {
    const normalizedSize = Math.ceil(size / 4) * 4;
    const res = new DataView(this.memory, this.currentComponentLocalOffset, normalizedSize);
    this.currentComponentLocalOffset += normalizedSize;
    return res;
  }
}
