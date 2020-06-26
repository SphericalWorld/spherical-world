import type { Alternative } from '../algebraicDataTypes/Alternative';
import type { Monad } from '../algebraicDataTypes/Monad';

export type Maybe<T> = TNothing<T> | Just<T>;

class Just<T> implements Monad<T>, Alternative<T> {
  isJust: true = true;
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<G>(mapFn: (T) => G): Maybe<G> {
    return new Just(mapFn(this.value));
  }

  extract(): T {
    return this.value;
  }

  chain<G>(fn: (T) => Maybe<G>): Maybe<G> {
    return fn(this.value);
  }

  alt(value: Maybe<T>): Maybe<T> { // eslint-disable-line no-unused-vars
    return this;
  }

  ap<B>(b: Maybe<(T) => B>) {
    return b.isJust === true ? this.map(b.value) : b;
  }

  static zero() {
    return Nothing;
  }
}

const JustFactory = <T>(value: T): Maybe<T> => new Just(value);

class TNothing<T> implements Monad<T>, Alternative<T> {
  isJust: false = false;

  map<G>(mapFn: (T) => G): TNothing<G> { // eslint-disable-line no-unused-vars
    return this;
  }

  chain<G>(fn: (T) => Maybe<G>): Maybe<G> { // eslint-disable-line no-unused-vars
    return this;
  }

  alt(value: Maybe<T>): Maybe<T> {
    return value;
  }

  ap<B>(b: Maybe<(T) => B>): TNothing { // eslint-disable-line no-unused-vars
    return this;
  }

  static zero() {
    return Nothing;
  }
}

export const Nothing = new TNothing();

export { JustFactory as Just };
