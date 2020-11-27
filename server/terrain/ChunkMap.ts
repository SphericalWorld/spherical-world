import { createArray } from '../../common/utils/array';

export default class ChunkMap<A> {
  data: A[];

  constructor(data: A[]) {
    this.data = data;
  }

  map<B>(mapFn: (data: A, i: number, j: number) => B): ChunkMap<B> {
    return new ChunkMap(this.data.map((el, i) => mapFn(el, i & 0xf, i >>> 4)));
  }

  get(x: number, z: number): A {
    return this.data[((z & 0xf) << 4) + (x & 0xf)];
  }

  static of<T>(filler: T): ChunkMap<T> {
    const data: T[] = createArray(256, filler);
    return new ChunkMap(data);
  }
}
