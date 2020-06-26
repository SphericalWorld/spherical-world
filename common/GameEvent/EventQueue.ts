export default class EventQueue<T> {
  events: T[] = [];

  push(event: T) {
    this.events.push(event);
  }

  clear() {
    this.events = [];
  }
}
