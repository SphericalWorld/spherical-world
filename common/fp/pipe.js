// @flow
import type { Monad } from './algebraicDataTypes/Monad';

import chain from './algebraicDataTypes/Chain';

export const pipeMonadic = (...ms: ((any) => Monad<any>)[]) => (
  ms.reduce((f, g) => x => chain(g)(f(x)))
);
