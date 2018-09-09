// @flow
import type { Component } from '../../../common/ecs/Component';
import type GlObject from '../engine/glObject';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Visual implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'visual' = 'visual';
  static componentType: { 'visual': Visual };

  enabled: boolean = true;

  glObject: GlObject;

  constructor(glObject: GlObject) {
    this.glObject = glObject;
  }
}
