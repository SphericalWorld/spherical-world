// @flow
export interface Filterable<T> {
  filter(predicate: (value: T) => boolean): Filterable<T>;
}
