export default class EventQueue<T> {
  events: T[] = [];

  push(event: T): void {
    this.events.push(event);
  }

  clear(): void {
    this.events = [];
  }
}
