// @flow

export interface Functor<T> {
  map<U>(f: T => U): Functor<U>
}
