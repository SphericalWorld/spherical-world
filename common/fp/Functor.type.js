// @flow

export interface Functor<T> {
  map<U>(fn: T => U): Functor<U>
}

const map = <U>(fn: * => U) => <T>(functor: Functor<T>): Functor<U> => functor.map(fn);

export default map;
