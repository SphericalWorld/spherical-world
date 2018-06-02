// @flow
export interface Applicative<R> {
  +ap: <U>(fn: R => Applicative<U>) => Applicative<U>;
}
