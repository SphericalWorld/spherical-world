// @flow
import type { Filterable } from '../fp/algebraicDataTypes/Filterable';
import type { Functor } from '../fp/algebraicDataTypes/Functor';

import EventQueue from './EventQueue';

export const Empty = Symbol('Empty');

export default class EventObservable<T> implements Filterable<T>, Functor<T> {
  subscriptions: EventObservable<*>[] = [];
  observer: Function;
  pipeline: Function[] = [];

  subscribeQueue(): EventQueue<T> {
    const queue = new EventQueue();
    this.subscribe(event => queue.push(event));
    return queue;
  }

  subscribe(observer: T => any) {
    this.subscriptions.push(this);
    this.observer = observer;
  }

  emit(event: T) {
    for (let i = 0; i < this.subscriptions.length; i += 1) {
      let mappedEvent = event;
      for (let j = 0; j < this.subscriptions[i].pipeline.length; j += 1) {
        mappedEvent = this.subscriptions[i].pipeline[j](mappedEvent);
        if (mappedEvent === Empty) {
          break;
        }
      }
      if (mappedEvent !== Empty) {
        this.subscriptions[i].observer(mappedEvent);
      }
    }
  }

  filter<U>(predicate: (value: T) => boolean | U): EventObservable<U> {
    const filtered = new EventObservable();
    filtered.subscriptions = this.subscriptions;
    filtered.pipeline = [...this.pipeline, (event: T) => (predicate(event) ? event : Empty)];
    return filtered;
  }

  map<U>(mapper: T => U): EventObservable<U> {
    const mapped: EventObservable<U> = new EventObservable();
    mapped.subscriptions = this.subscriptions;
    mapped.pipeline = [...this.pipeline, (event: T) => mapper(event)];
    return mapped;
  }
}
