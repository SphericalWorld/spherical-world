import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

/**
 * Component to mark Entity as affected by Physics System
 */
export class Physics extends Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'physics' = 'physics';
}
