import type { Functor } from './Functor';

export interface Apply<A> extends Functor<A> {
  ap: <B>(applicative: Apply<(a: A) => B>) => Apply<B>;
}
