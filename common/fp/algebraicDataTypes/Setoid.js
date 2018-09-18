// @flow strict
export interface Setoid<This> {
  equals(a: This): boolean;
}
