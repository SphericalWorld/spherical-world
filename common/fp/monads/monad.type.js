// @flow
import type { Chain } from '../chain.type';
import type { Applicative } from '../Applicative.types';

export interface Monad<+R> extends Chain<R>, Applicative<R> {

}
