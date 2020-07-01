import { v4 as uuid } from 'uuid';
import type { Entity } from './Entity';
import type { World } from './World';
import { Component } from './Component';

type ComponentLike = { componentName: string; new (...params: any[]): any };
type Obj<T extends ComponentLike> = {
  [key in T['componentName']]: InstanceType<T>;
};

type Merge<A, B> = SpreadTypes<A, B>;

export type transform = (<A extends ComponentLike, B extends ComponentLike>(
  includeComponents: [A, B],
  excludeComponents?: ReadonlyArray<ComponentLike>,
) => ReadonlyArray<Merge<{ id: Entity } & Obj<A>, Obj<B>>>) &
  (<A extends ComponentLike, B extends ComponentLike, C extends ComponentLike>(
    includeComponents: [A, B, C],
    excludeComponents?: ReadonlyArray<ComponentLike>,
  ) => ReadonlyArray<Merge<Merge<{ id: Entity } & Obj<A>, Obj<B>>, Obj<C>>>) &
  (<
    A extends ComponentLike,
    B extends ComponentLike,
    C extends ComponentLike,
    D extends ComponentLike
  >(
    includeComponents: [A, B, C, D],
    excludeComponents?: ReadonlyArray<ComponentLike>,
  ) => ReadonlyArray<Merge<Merge<Merge<{ id: Entity } & Obj<A>, Obj<B>>, Obj<C>>, Obj<D>>>);

export type GameObject<T> = $Call<transform>;

export class EntitySelector<T> {
  includeComponents: T;
  excludeComponents: Class<Component>[];
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
