// @flow
import type { Component } from '../components/Component';

export interface System {
  update(delta: number): void | (string | Component)[][];
}
