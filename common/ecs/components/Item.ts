import { Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';

/**
 * Component to mark entity a pickable item
 */
export class Item extends Component {
  static threads = [THREAD_MAIN];
  static componentName: 'item' = 'item';
}
