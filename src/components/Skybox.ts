import { vec3 } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN } from '../Thread/threadConstants';

export default class Skybox extends Component<{}> {
  static threads = [THREAD_MAIN];
  static componentName: 'skybox' = 'skybox';

  sunPosition: vec3 = vec3.create();
}

/**
 * Component to keep skybox-related data
 */
export const SkyboxComponent = (_: {}): JSX.Element => new Skybox();
