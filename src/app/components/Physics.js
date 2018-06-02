// @flow
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Physics {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
}
