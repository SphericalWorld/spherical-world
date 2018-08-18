// @flow
import type { Component } from './Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class BlockRemover implements Component {
  static threads = [THREAD_MAIN];
  static componentName = 'blockRemover';
  static componentType: { 'blockRemover': BlockRemover };

  removing: boolean = false;
  removedPart: number = 0.0;
}
