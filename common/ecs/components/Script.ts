import { Component } from '../Component';
import type { Entity } from '../Entity';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import type { World } from '../World';

export class Script extends Component {
  static threads = [THREAD_MAIN];
  static componentName: 'script' = 'script';
  static networkable = true;

  gameObject: any;

  constructor() {
    super();
  }

  setGameObject(gameObject): void {
    this.gameObject = gameObject;
  }

  start(world: World) {}

  update(delta: number) {}
}
