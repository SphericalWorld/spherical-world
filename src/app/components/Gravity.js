// @flow
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Gravity {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'gravity';
}
