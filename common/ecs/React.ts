import type { StatelessFunctionalComponent } from 'react';
import type { World } from './World';
import type { Entity } from './Entity';
import { EntityManager } from './EntityManager';

export const Fragment = () => null;

type Context<T> = Readonly<{
  stack: T[];
}>;

export const createContext = <T extends unknown>(value?: T): Context<T> => ({
  stack: value !== undefined ? [value] : [],
});

export const useContext = <T extends unknown>(context: Context<T>): T =>
  context.stack[context.stack.length - 1];

const worlds: Context<World> = createContext();

export const GameObject = <T extends any>(params: T): React$Element<any> => params;

export const createElement: React$CreateElement = <Props extends { id: Entity }, T extends Props>(
  component: StatelessFunctionalComponent<T>,
  origProps: Props | null,
  ...children
) => {
  if (component === Fragment) {
    return children;
  }

  if (component !== GameObject) {
    const { id = EntityManager.generateId(), ...props } = origProps === null ? {} : origProps;
    const newProps = { id, ...props };
    const res: { children: any[] } = component(newProps) as any;
    if (res.children instanceof Array) {
      res.children = res.children.concat(children);
    }
    return res;
  }
  const { id = null, ...rest } = origProps === null ? {} : origProps;
  const world = useContext(worlds);
  const element = world.createEntity(
    id,
    ...Object.values(rest),
    ...children.flat().filter((el) => !el.id),
  );
  return element;
};

export const render = <T>(component: StatelessFunctionalComponent<T>, world: World) => {
  worlds.stack.push(world);
  createElement(component, null);
};
