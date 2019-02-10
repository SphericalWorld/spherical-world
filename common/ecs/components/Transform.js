// @flow strict
import { type Vec3, type Quat, vec3 } from 'gl-matrix';
import { type Component } from '../Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import { Networkable } from '../../Networkable';

const PARENT = Symbol('parent');

const ZERO_VECTOR = vec3.create();

export default class Transform implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'transform' = 'transform';
  static componentType: {| 'transform': Transform |};
  static networkable = true;

  translation: Vec3 = vec3.create();
  rotation: Quat = [0, 0, 0, 1];
  [PARENT]: any;

  constructor(translation: Vec3 = ZERO_VECTOR, parent?: any) {
    vec3.copy(this.translation, translation);
    this[PARENT] = parent;
  }

  static deserialize(data: Transform): Transform {
    const res = new Transform(data.translation);
    res.rotation = data.rotation;
    return res;
  }

  serialize(): mixed {
    return {
      translation: Array.from(this.translation),
      rotation: Array.from(this.rotation),
    };
  }

  getParent() {
    return this[PARENT];
  }
}

/**
 * Contains positional data, such as coordinates and rotation
 * @param {Vec3} translation 3D world coordinates
 * @param {Entity} parent parent object in hierarchy
 */
export const TransformComponent = ({
  translation, parent,
}: {|
  translation?: Vec3, parent?: any,
|}) =>
  // $FlowFixMe
  new Transform(translation, parent);
