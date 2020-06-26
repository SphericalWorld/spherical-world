import type { Monad } from '../algebraicDataTypes/Monad';

class IOMonad<R> implements Monad<R> {
  fn: () => R;
  // We construct the IOMonad type with a thunk/callback that returns the value when called
  constructor(fn: () => R) {
    this.fn = fn;
  }

  // IOMonad doesn't do anything until we explicitly call it.
  run(): R {
    return this.fn();
  }

  // Create a new IOMonad value containing a thunk that calls the
  // previous one and runs a translation on it
  // / map :: IOMonad a -> (a -> b) -> IOMonad b
  map<U>(fn: (R) => U): IOMonad<U> {
    return new IOMonad(() => fn(this.run()));
  }

  // Create a new IOMonad value with a monadic bind. Similar to `map`, but
  // the underlying function itself returns an IOMonad that must be unwrapped as well.s
  // / bind :: IOMonad a -> (a -> IOMonad b) -> IOMonad b
  chain<U>(fn: (R) => IOMonad<U>): IOMonad<U> {
    return new IOMonad(() => fn(this.run()).run());
  }

  static of<T>(value: T): IOMonad<T> {
    return new IOMonad(() => value);
  }

  static from<T>(fn: () => T): IOMonad<T> {
    return new IOMonad(fn);
  }
}

export default IOMonad;
