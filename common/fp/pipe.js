// @flow
import type IOMonad from './monads/io';

import chain from './algebraicDataTypes/Chain.type';

export const pipeMonadic = (...ms: ((any) => IOMonad<any>)[]) => (
  ms.reduce((f, g) => x => chain(g)(f(x)))
);
