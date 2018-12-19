// @flow strict
import type { Thread as IThread } from '../../common/Thread';
import type { THREAD_ID } from './threadConstants';
import EventObservable from '../../common/GameEvent/EventObservable';

class Thread implements IThread {
  +id: THREAD_ID;
  +events: EventObservable<any> = new EventObservable();
  +thread: Worker;

  constructor(id: THREAD_ID, thread: Worker) {
    this.id = id;
    this.thread = thread;

    thread.onmessage = (e) => {
      this.events.emit(e.data);
    };
  }

  postMessage(message: any, ports?: any): void {
    this.thread.postMessage(message, ports);
  }
}

export default Thread;
