import type { Monad } from './algebraicDataTypes/Monad';

export const pipe = (...ms: ((any) => Monad<any>)[]) => ms.reduce((f, g) => (x) => f(g(x)));

export const pipeMonadic = (...ms: ((any) => Monad<any>)[]) =>
  ms.reduce((f, g) => (x) => f(x).chain(g));
