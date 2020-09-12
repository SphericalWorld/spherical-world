import type { Component } from '../Component';
import type { Entity } from '../Entity';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import type { MemoryManager } from '../MemoryManager';
import type { World } from '../World';

export default class Script implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'script' = 'script';
  static networkable = true;
  static memoryManager: MemoryManager;

  gameObject: any;

  constructor() {}

  setGameObject(gameObject): void {
    this.gameObject = gameObject;
  }

  start(world: World) {}

  update(delta: number) {}
}

export type ScriptProps = {};

export const ScriptComponent = (props: ScriptProps): JSX.Element => ({
  type: Script,
  props,
  key: null,
});
