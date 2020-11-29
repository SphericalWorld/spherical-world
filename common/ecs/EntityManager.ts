import { v4 as uuid } from 'uuid';
import type { Entity } from './Entity';
import type { World } from './World';
import type { Component } from './Component';

type ComponentLike = { componentName: string; new (...params: any[]): any };
type Obj<T extends ComponentLike> = {
  [key in T['componentName']]: InstanceType<T>;
};

type Merge<A> = A extends [infer First, ...infer Rest] ? SpreadTypes<First, Merge<Rest>> : unknown;

export type transform = <A extends ComponentLike[]>(
  includeComponents: [...A],
  excludeComponents?: ReadonlyArray<ComponentLike>,
) => ReadonlyArray<
  Merge<
    [
      { id: Entity },
      ...{
        [K in keyof A]: A[K] extends ComponentLike ? Obj<A[K]> : never;
      }
    ]
  >
>;

export type GameObject<T> = ReturnType<transform>[number];

export class EntitySelector<T extends typeof Component> {
  includeComponents: T[];
  excludeComponents: typeof Component[];
  components: GameObject<T>[] = [];
  world: World;

  constructor(world: World, includeComponents: T[], excludeComponents: typeof Component[] = []) {
    this.world = world;
    this.includeComponents = includeComponents;
    this.excludeComponents = excludeComponents;
  }

  addEntity(entityId: Entity, componentMap: Map<string, Component<{}>>): void {
    if (
      this.includeComponents.every((componentType) =>
        componentMap.has(componentType.componentName),
      ) &&
      !this.excludeComponents.find((componentType) => componentMap.has(componentType.componentName))
    ) {
      const selectedComponents = {
        id: entityId,
      };
      for (let i = 0; i < this.includeComponents.length; i += 1) {
        const component = componentMap.get(this.includeComponents[i].componentName);
        if (this.includeComponents[i].componentName === 'script') {
          component.setGameObject(componentMap);
          component.start(this.world);
        }

        selectedComponents[this.includeComponents[i].componentName] = component;
      }
      this.components.push(selectedComponents);
    }
  }
}

export class EntityManager {
  static generateId(): Entity {
    return uuid();
  }
}
