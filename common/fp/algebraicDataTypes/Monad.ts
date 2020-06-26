import type { Chain } from './Chain';
import type { Applicative } from './Applicative';

export interface Monad<A> extends Chain<A>, Applicative<A> {

}
