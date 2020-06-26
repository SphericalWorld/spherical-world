import type { Functor } from './Functor';

export interface Alt<A> extends Functor<A> {
  alt(b: Alt<A>): Alt<A>
}
