import { Component } from '../../common/ecs/Component';
import type GlObject from '../engine/glObject';
import { THREAD_MAIN } from '../Thread/threadConstants';

/**
 * Component with data to render Entity in 3D game world
 * @param {GlObject} glObject object with visual data to render
 */
export class Visual extends Component<{ object: GlObject }> {
  static threads = [THREAD_MAIN];
  static componentName: 'visual' = 'visual';

  enabled = true;

  glObject: GlObject;

  constructor({ object }: { object: GlObject }) {
    super();
    this.glObject = object;
  }
}
