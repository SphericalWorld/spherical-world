// @flow
import type { Applicative } from './Applicative';
import type { Plus } from './Plus';

export interface Alternative<+R> extends Plus<R>, Applicative<R> {

}
