import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

/**
 * Component to mark Entity as affected by gravity
 */
export class Gravity extends Component<{}> {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'gravity' = 'gravity';
}
