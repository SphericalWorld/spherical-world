import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Physics implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'physics' = 'physics';
}

/**
 * Component to mark Entity as affected by Physics System
 */
export const PhysicsComponent = (_: {}): JSX.Element => new Physics();
