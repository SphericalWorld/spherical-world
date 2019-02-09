// @flow strict
import { type ComponentType } from 'react';
import { type World } from './World';
import { EntityManager } from './EntityManager';

export const Fragment = () => null;

type Context<T> = {|
  +stack: T[],
|}

export const createContext = <T>(value?: T): Context<T> => ({
  stack: value !== undefined ? [value] : [],
});

export const useContext = <T>(context: Context<T>): T => context.stack[context.stack.length - 1];

const worlds: Context<World> = createContext();

export const createElement: React$CreateElement = <T>(component: ComponentType<T>, origProps, ...children): number => {
  if (component === Fragment) {
    return children;
  }
  origProps = origProps === null ? {} : origProps;
  const { id = EntityManager.generateId(), ...props } = origProps;
  const newProps = { id, ...props };
  const res = component(newProps);

  if (res !== newProps) {
    if (!res.children) {
      return res;
    }
    res.children = res.children.concat(children);

    return res;
  }

  const world = useContext(worlds);
  const element = world.createEntity(id, ...children.flat().filter(el => !el.id));
  return element;
};

export const render = (component: React$Component<*>, world: World) => {
  worlds.stack.push(world);
  createElement(component, null);
};

export const GameObject = <T>(params: T): React$Element<*> => params;
