export interface Filterable<A> {
  filter(predicate: (value: A) => boolean): Filterable<A>;
}
