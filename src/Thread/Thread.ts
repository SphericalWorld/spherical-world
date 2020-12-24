import type { Thread as IThread } from '../../common/Thread';
import type { THREAD_ID } from './threadConstants';
import EventObservable from '../../common/GameEvent/EventObservable';

class Thread implements IThread {
  readonly id: THREAD_ID;
  readonly events: EventObservable<any> = new EventObservable();
  readonly thread: Worker;

  constructor(id: THREAD_ID, thread: Worker) {
    this.id = id;
    this.thread = thread;

    thread.addEventListener('message', (e) => {
      this.events.emit(e.data);
    });
  }

  postMessage(message: unknown, ports?: any): void {
    this.thread.postMessage(message, ports);
  }
}

export default Thread;
