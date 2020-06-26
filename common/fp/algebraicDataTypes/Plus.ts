import type { Alt } from './Alt';

export interface Plus<A> extends Alt<A> {
  constructor: {
    zero(): Plus<A>,
  }
}
