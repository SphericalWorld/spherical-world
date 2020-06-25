// @flow strict
import {v4 as uuid} from 'uuid';
import type { Entity } from './Entity';
import { type World } from './World';
import { Component } from './Component';

type SelectorFunction = (Entity) => boolean;

type Z<T> = $PropertyType<T, 'componentType'>;

type inner = (<A>([]) => { id: Entity })
& (<A>([A]) => { ...Z<A>, id: Entity })
& (<A, B>([A, B]) => { ...Z<A>, ...Z<B>, id: Entity })
& (<A, B, C>([A, B, C]) => { ...Z<A>, ...Z<B>, ...Z<C>, id: Entity })
& (<A, B, C, D>([A, B, C, D]) =>{ ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, id: Entity })
& (<A, B, C, D, E>([A, B, C, D, E]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, id: Entity })
& (<A, B, C, D, E, F>([A, B, C, D, E, F]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, ...Z<F>, id: Entity }) // eslint-disable-line max-len
& (<A, B, C, D, E, F, G>([A, B, C, D, E, F, G]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, ...Z<F>, ...Z<G>, id: Entity }) // eslint-disable-line max-len
& (<A, B, C, D, E, F, G, H>([A, B, C, D, E, F, G, H]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, ...Z<F>, ...Z<G>, ...Z<H>, id: Entity }) // eslint-disable-line max-len
& (<A, B, C, D, E, F, G, H, I>([A, B, C, D, E, F, G, H, I]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, ...Z<F>, ...Z<G>, ...Z<H>, ...Z<I>, id: Entity }) // eslint-disable-line max-len
& (<A, B, C, D, E, F, G, H, I, J>([A, B, C, D, E, F, G, H, I, J]) => { ...Z<A>, ...Z<B>, ...Z<C>, ...Z<D>, ...Z<E>, ...Z<F>, ...Z<G>, ...Z<H>, ...Z<I>, ...Z<J>, id: Entity }); // eslint-disable-line max-len

export type transform = inner;
export type GameObject<T> = $Call<transform, T>;

export class EntitySelector<T> {
  includeComponents: T;
  excludeComponents: Class<Component>[];
  selectorFunction: SelectorFunction;
  components: GameObject<T>[] = [];

  constructor(world: World, includeComponents: T, excludeComponents: Class<Component>[] = []) {
    this.includeComponents = includeComponents;
    this.excludeComponents = excludeComponents;
  }
}

export class EntityManager {
  static generateId(): Entity {
    return uuid();
  }
}
