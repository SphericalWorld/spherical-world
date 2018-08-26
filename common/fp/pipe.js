// @flow
import type { Monad } from './algebraicDataTypes/Monad.type';

import chain from './algebraicDataTypes/Chain.type';

export const pipeMonadic = (...ms: ((any) => Monad<any>)[]) => (
  ms.reduce((f, g) => x => chain(g)(f(x)))
);
