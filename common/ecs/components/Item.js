// @flow strict
import { type Component } from '../Component';
import { THREAD_MAIN } from '../../../src/Thread/threadConstants';

export default class Item implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'item' = 'item';
  static componentType: {| 'item': Item |};
}

/**
 * Component to mark entity a pickable item
 */
export const ItemComponent = (_: {||}) =>
  // $FlowFixMe
  new Item();
