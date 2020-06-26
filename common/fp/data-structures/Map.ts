import type { Maybe } from '../monads/maybe';
import { Nothing, Just } from '../monads/maybe';

export default class HashMap<K, V> {
  data: Map<K, V>;

  constructor(values?: ReadonlyArray<[K, V]>) {
    this.data = new Map(values);
  }

  get(key: K): Maybe<V> {
    const item = this.data.get(key);
    return item === undefined
      ? Nothing
      : Just(item);
  }

  set(key: K, value: V): void {
    this.data.set(key, value);
  }

  delete(key: K) {
    this.data.delete(key);
  }

  values(): Iterator<V> {
    return this.data.values();
  }

  entries(): Iterator<[K, V]> {
    return this.data.entries();
  }
}
