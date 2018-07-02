// @flow
import { Nothing, Just } from '../fp/monads/maybe';
import type { Maybe } from '../fp/monads/maybe';

const parseJson = (data: string): Maybe<Object> => {
  try {
    return Just(JSON.parse(data));
  } catch (e) {
    return Nothing;
  }
};

export default parseJson;
