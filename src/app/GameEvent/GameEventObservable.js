// @flow

import type GameEventQueue from './GameEventQueue';

export default class GameEventObservable {
  eventQueues: GameEventQueue[] = [];
  subscriptions: Function[] = [];

  subscribeQueue(queue: GameEventQueue) {
    this.eventQueues.push(queue);
  }

  subscribe(callback: Function) {
    this.subscriptions.push(callback);
  }

  emit(payload: Object) {
    for (let i = 0; i < this.eventQueues.length; i += 1) {
      this.eventQueues[i].push(payload);
    }
    for (let i = 0; i < this.subscriptions.length; i += 1) {
      this.subscriptions[i]();
    }
  }
}
