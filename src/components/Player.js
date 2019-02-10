// @flow strict
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export default class Player implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'player';
  static componentType: {| 'player': Player |};
}

/**
 * Component to mark Entity as related to current player, to distinguish entities controlled by
 * the player in case if same components have different logic for current player and others
 */
export const PlayerComponent = (_: {||}) =>
  // $FlowFixMe
  new Player();
