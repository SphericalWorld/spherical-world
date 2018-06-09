// @flow
import GlObject from '../engine/glObject';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Visual {
  static threads = [THREAD_MAIN];
  static componentName = 'visual';

  glObject: GlObject;

  constructor(glObject: GlObject) {
    this.glObject = glObject;
  }
}
