// @flow
import type { Monad } from './monad.type';

declare type Just<T> = {
  value: T,
  static (value: T): Just<T>,
  map<G>(T => G): Just<G>,
  chain<T, G>(fn: T => Maybe<G>): Maybe<G>,
  extract(): T,
  isJust: true,
}

const proto = {
  map<T, G>(mapFn: T => G) {
    (this: Just<T>);
    return new this.constructor(mapFn(this.value));
  },
  extract() {
    return this.value;
  },
  chain<T, G>(fn: T => Maybe<G>): Maybe<G> {
    return fn(this.value);
  },
};

export function Just<T>(value: T) {
  const just = Object.create(proto);
  just.isJust = true;
  just.value = value;
  return just;
}

declare type TNothing<T> = {
  value: T,
  static (value: T): TNothing<T>,
  map<G>(T => G): TNothing<T>,
  chain<T, G>(fn: T => Maybe<G>): TNothing<G>,
  extract(): T,
  isJust: false,
}

class TNothing implements Monad<*> {
  isJust: false = false;

  map<G>(mapFn: * => G): TNothing {
    return this;
  }

  extract(): * {
    throw new Error('Unable to extract from Nothing');
  }

  chain<T, G>(fn: T => Maybe<G>): Maybe<G> {
    return this;
  }
}

export const Nothing = new TNothing();

export type Maybe<T> = TNothing<T> | Just<T>;
