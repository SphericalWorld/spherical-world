import type { Applicative } from './Applicative';
import type { Plus } from './Plus';

export interface Alternative<A> extends Plus<A>, Applicative<A> {

}
