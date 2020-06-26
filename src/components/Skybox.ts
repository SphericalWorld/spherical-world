import { vec3 } from 'gl-matrix';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Skybox implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'skybox' = 'skybox';

  sunPosition: vec3 = [0, 0, 0];
}

/**
 * Component to keep skybox-related data
 */
export const SkyboxComponent = (_: {}) =>
  new Skybox();
