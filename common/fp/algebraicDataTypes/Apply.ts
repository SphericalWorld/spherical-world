import type { Functor } from './Functor';

export interface Apply<A> extends Functor<A> {
  ap: <B>(applicative: Apply<(A) => B>) => Apply<B>;
}
