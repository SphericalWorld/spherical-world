// @flow
import type { THREAD_ID } from './threadConstants';
import EventObservable from '../GameEvent/EventObservable';

class Thread {
  +id: THREAD_ID;
  +events: EventObservable<any> = new EventObservable();
  +thread: Worker;

  constructor(id: THREAD_ID, thread: Worker) {
    this.id = id;
    this.thread = thread;

    thread.onmessage = (e) => {
      this.events.emit(e.data);
    };

    // eslint-disable-next-line
    self.registerMessageHandler = function(message, handler){
      if (typeof (handler) === 'function') {
        // eslint-disable-next-line
        self.__router__[message] = handler;
      }
    };
  }

  postMessage(message: any, ports?: any): void {
    this.thread.postMessage(message, ports);
  }
}

export default Thread;
