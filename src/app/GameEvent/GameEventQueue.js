// @flow
import GameEventObservable from './GameEventObservable';

export default class GameEventQueue {
  events: GameEventObservable[] = [];

  constructor(...events: GameEventObservable[]) {
    for (const event of events) {
      event.subscribeQueue(this);
    }
  }

  push(event: GameEventObservable) {
    this.events.push(event);
  }

  clear() {
    this.events = [];
  }
}
