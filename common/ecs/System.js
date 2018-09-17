// @flow
import type { Component } from './Component';
import type { Entity } from './Entity';

export type UpdatedComponents = (Entity | Component)[][];

export interface System {
  update(delta: number): ?UpdatedComponents;
}
