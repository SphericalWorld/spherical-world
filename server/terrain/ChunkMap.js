// @flow
import type { Functor } from '../../common/fp/algebraicDataTypes/Functor';
import type { Foldable } from '../../common/fp/algebraicDataTypes/Foldable';
import { createArray } from '../../common/utils/array';

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

export default class ChunkMap<A> implements Functor<A>, Foldable<A> {
  data: A[];

  constructor(data: A[]) {
    this.data = data;
  }

  map<B>(mapFn: (A, i: number, j: number) => B): ChunkMap<B> {
    return new ChunkMap(this.data.map((el, i) => mapFn(el, i & 0xF, i >>> 4)));
  }

  // reduce(reducer: (T, T, number, T[]) => T, initial?: T): T {
  //   return this.data.reduce(reducer, initial);
  // }

  reduce<B>(
    reducer: (B, A, number, A[]) => B,
    initial?: B = this.data[0],
  ): B {
    return this.data.reduce(reducer, initial);
  }

  get(i: number, j: number): A {
    return this.data[(i << 4) + j];
  }

  static of(filler: A): ChunkMap<A> {
    const data: A[] = createArray(256, filler);
    return new ChunkMap(data);
  }
}
