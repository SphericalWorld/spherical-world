// @flow strict
import type { Maybe } from '../monads/maybe';
import { Nothing, Just } from '../monads/maybe';

export default class HashMap<K, V> extends Map<K, V> {
  get(key: K): Maybe<V> {
    const item = super.get(key);
    return item === undefined
      ? Nothing
      : Just(item);
  }
}
