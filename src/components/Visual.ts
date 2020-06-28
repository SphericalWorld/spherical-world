import type { Component } from '../../common/ecs/Component';
import type GlObject from '../engine/glObject';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Visual implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'visual' = 'visual';

  enabled = true;

  glObject: GlObject;

  constructor(glObject: GlObject) {
    this.glObject = glObject;
  }
}

/**
 * Component with data to render Entity in 3D game world
 * @param {GlObject} glObject object with visual data to render
 */
export const VisualComponent = ({ object }: { object: GlObject }): JSX.Element =>
  new Visual(object);
