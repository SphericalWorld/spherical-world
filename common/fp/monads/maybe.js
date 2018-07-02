// @flow
import type { Monad } from './monad.type';

declare class Just<T> {
  value: T,
  static (value: T): Just<T>,
  map<G>(T => G): Just<G>,
}

const proto = {
  map<T, G>(mapFn: T => G) {
    (this: Just<T>);
    return new this.constructor(mapFn(this.value))
  }
};

export function Just<T>(value: T) {
  const just = Object.create(proto);
  just.value = value;
  return just;
}

class TNothing implements Monad<*> {
  map<G>(mapFn: * => G): TNothing {
    return this;
  }
}

export const Nothing = new TNothing();

export type Maybe<T> = TNothing | Just<T>;
