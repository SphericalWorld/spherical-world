// @flow
import type IOMonad from './monads/io';

export const pipeMonadic = (...ms: ((any) => IOMonad<any>)[]) => (
  ms.reduce((f, g) => x => f(x).chain(g))
);
