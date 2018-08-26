// @flow
import type { Functor } from './Functor.type';

export interface Alt<+R> extends Functor<R> {
  alt(b: Alt<R>): Alt<R>
}
