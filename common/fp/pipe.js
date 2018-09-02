// @flow
import type { Monad } from './algebraicDataTypes/Monad';

export const pipeMonadic = (...ms: ((any) => Monad<any>)[]) => (
  ms.reduce((f, g) => x => f(x).chain(g))
);
