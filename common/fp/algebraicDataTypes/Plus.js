// @flow
import type { Alt } from './Alt';

export interface Plus<+R> extends Alt<R> {
  +constructor: {
    zero(): Plus<R>,
  }
}
