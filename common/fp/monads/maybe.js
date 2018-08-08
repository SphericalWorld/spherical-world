// @flow
import type { Monad } from './monad.type';

// declare class Just<T> {
//   value: T,
//   static (value: T): Just<T>,
//   map<G>(T => G): Just<G>,
//   chain<T, G>(fn: T => Maybe<G>): Maybe<G>,
//   extract(): T,
//   isJust: true,
// }
//
// declare class TNothing<T> = {
//   value: T,
//   static (value: T): TNothing<T>,
//   map<G>(T => G): TNothing<T>,
//   chain<T, G>(fn: T => Maybe<G>): TNothing<G>,
//   isJust: false,
// }

export type Maybe<T> = TNothing<T> | Just<T>;

class Just<T> implements Monad<T> {
  +isJust: true = true;
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<G>(mapFn: T => G): Maybe<G> {
    return new this.constructor(mapFn(this.value));
  }

  extract(): T {
    return this.value;
  }

  chain<G>(fn: T => Maybe<G>): Maybe<G> {
    return fn(this.value);
  }
}

const JustFactory = <T>(value: T): Maybe<T> => new Just(value);

class TNothing<T> implements Monad<*> {
  +isJust: false = false;

  map<G>(mapFn: * => G): TNothing {
    return this;
  }

  chain<T, G>(fn: T => Maybe<G>): Maybe<G> {
    return this;
  }
}

export const Nothing = new TNothing();

export { JustFactory as Just };
