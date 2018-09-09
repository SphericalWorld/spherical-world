// @flow
import type { Component } from './Component';

export interface System {
  update(delta: number): void | (string | Component)[][];
}
