// @flow
import type { Component } from '../components/Component';
import type World from '../ecs/World';

export interface System {
  world: World;
  update(delta: number): void | (string | Component)[][];
}
