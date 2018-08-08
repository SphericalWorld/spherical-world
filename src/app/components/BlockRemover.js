// @flow
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class BlockRemover {
  static threads = [THREAD_MAIN];
  static componentName = 'blockRemover';

  removedPart = 0.0;
}
