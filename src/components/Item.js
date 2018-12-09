// @flow strict
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Item implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'item' = 'item';
  static componentType: {| 'item': Item |};
}
