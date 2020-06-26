import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Gravity implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'gravity' = 'gravity';
}

/**
 * Component to mark Entity as affected by gravity
 */
export const GravityComponent = (_: {}) => new Gravity();
