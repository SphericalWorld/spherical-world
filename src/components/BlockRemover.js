// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class BlockRemover implements Component {
  static threads = [THREAD_MAIN];
  static componentName = 'blockRemover';
  static componentType: {| 'blockRemover': BlockRemover |};

  removing: boolean = false;
  removedPart: number = 0.0;
  position: Vec3 = vec3.create();
}
