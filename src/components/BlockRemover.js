// @flow strict
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

/**
 * Component to allow entity to destroy blocks. Used to destroy blocks by players
 */
export const BlockRemoverComponent = (_: {||}) =>
  // $FlowFixMe
  new BlockRemover();
