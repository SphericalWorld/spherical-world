import { vec3 } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

/**
 * Component to allow entity to destroy blocks. Used to destroy blocks by players
 */
export class BlockRemover extends Component<{}> {
  static threads = [THREAD_MAIN];
  static componentName: 'blockRemover' = 'blockRemover';

  removing = false;
  removedPart = 0.0;
  position: vec3 = vec3.create();
}
