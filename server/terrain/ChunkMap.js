// @flow
import type { Functor } from '../../common/fp/Functor.type';
import type { Foldable } from '../../common/fp/Foldable.type';
import { createArray } from '../../src/app/util/array';

// ((
//   callbackfn: (
//     previousValue: T,
//     currentValue: T,
//     currentIndex: number,
//     array: Array<T>
//   ) => T,
//   initialValue: void
// ) => T) & (<U>(
//   callbackfn: (
//     previousValue: U,
//     currentValue: T,
//     currentIndex: number,
//     array: Array<T>
//   ) => U,
//   initialValue: U
// ) => U)

export default class ChunkMap<T> implements Functor<T>, Foldable<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  map<U>(mapFn: (T, i: number, j: number) => U): ChunkMap<U> {
    return new ChunkMap(this.data.map((el, i) => mapFn(el, i >> 4, i & 0xF)));
  }

  // reduce(reducer: (T, T, number, T[]) => T, initial?: T): T {
  //   return this.data.reduce(reducer, initial);
  // }

  reduce<U>(
    reducer: (U, T, number, T[]) => U,
    initial?: U = this.data[0],
  ): U {
    return this.data.reduce(reducer, initial);
  }

  get(i: number, j: number): T {
    return this.data[(i << 4) + j];
  }

  static of(filler: T): ChunkMap<T> {
    const data: T[] = createArray(256, filler);
    return new ChunkMap(data);
  }
}
