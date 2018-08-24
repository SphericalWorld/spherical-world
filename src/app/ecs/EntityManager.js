// @flow
import uuid from 'uuid/v1';
import type { Entity } from './Entity';
import type World from './World';
import { Component } from '../components/Component';

type SelectorFunction = (Entity) => boolean;
const Base = {};

type Z<T> = $PropertyType<T, 'componentType'> | {};

declare function inner<A>([A]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>>>;
declare function inner<A, B>([A, B]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C>([A, ?B, ?C]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D>([A, ?B, ?C, ?D]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E>([A, ?B, ?C, ?D, ?E]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E, F>([A, ?B, ?C, ?D, ?E, ?F]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>, Z<F>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E, F, G>([A, ?B, ?C, ?D, ?E, ?F, ?G]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>, Z<F>, Z<G>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E, F, G, H>([A, ?B, ?C, ?D, ?E, ?F, ?G, ?H]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>, Z<F>, Z<G>, Z<H>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E, F, G, H, I>([A, ?B, ?C, ?D, ?E, ?F, ?G, ?H, ?I]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>, Z<F>, Z<G>, Z<H>, Z<I>>>; // eslint-disable-line max-len, no-redeclare
declare function inner<A, B, C, D, E, F, G, H, I, J>([A, ?B, ?C, ?D, ?E, ?F, ?G, ?H, ?I, J]): $Exact<$Call<Object$Assign, typeof Base, { id: Entity }, Z<A>, Z<B>, Z<C>, Z<D>, Z<E>, Z<F>, Z<G>, Z<H>, Z<I>, Z<J>>>; // eslint-disable-line max-len, no-redeclare

export type transform = typeof inner;

export class EntitySelector<T> {
  includeComponents: T;
  excludeComponents: (typeof Component)[];
  selectorFunction: SelectorFunction;
  components: $Call<transform, T>[] = [];

  constructor(world: World, includeComponents: T, excludeComponents: (typeof Component)[] = []) {
    this.includeComponents = includeComponents;
    this.excludeComponents = excludeComponents;
  }
}

export class EntityManager {
  static generateId(): string {
    return uuid();
  }
}
