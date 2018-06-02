// @flow
export interface Chain<+R> {
  +chain: <U>(fn: R => Chain<U>) => Chain<U>;
}
