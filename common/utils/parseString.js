// @flow strict
import { Nothing, Just } from '../fp/monads/maybe';
import type { Maybe } from '../fp/monads/maybe';

const parseJson = <T>(data: string): Maybe<T> => {
  try {
    return Just(JSON.parse(data));
  } catch (e) {
    return Nothing;
  }
};

export default parseJson;
