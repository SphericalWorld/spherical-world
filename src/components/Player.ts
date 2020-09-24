import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

/**
 * Component to mark Entity as related to current player, to distinguish entities controlled by
 * the player in case if same components have different logic for current player and others
 */
export class Player extends Component<{}> {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'player' = 'player';
}
