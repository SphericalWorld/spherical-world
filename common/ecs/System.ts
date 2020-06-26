import type { Component } from './Component';
import type { Entity } from './Entity';

export type UpdatedComponents = (Entity | Component)[][];

export type System = (delta: number) => UpdatedComponents | void;
