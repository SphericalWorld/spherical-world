// @flow
import type { Monad } from '../algebraicDataTypes/Monad.type';

export type Maybe<T> = TNothing<T> | Just<T>;

class Just<T> implements Monad<T> {
  +isJust: true = true;
  +value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<G>(mapFn: T => G): Maybe<G> {
    return new Just(mapFn(this.value));
  }

  extract(): T {
    return this.value;
  }

  chain<G>(fn: T => Maybe<G>): Maybe<G> {
    return fn(this.value);
  }
}

const JustFactory = <T>(value: T): Maybe<T> => new Just(value);

class TNothing<T> implements Monad<T> {
  +isJust: false = false;

  map<G>(mapFn: * => G): TNothing {
    return this;
  }

  chain<G>(fn: T => Maybe<G>): Maybe<G> {
    return this;
  }
}

export const Nothing = new TNothing();

export { JustFactory as Just };
