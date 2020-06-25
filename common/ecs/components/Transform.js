// @flow strict
import {
  type Vec3, type Quat, vec3, quat,
} from 'gl-matrix';
import { type Component } from '../Component';
import { type Entity } from '../Entity';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../../src/Thread/threadConstants';
import { Networkable } from '../../Networkable';

const ZERO_VECTOR = vec3.create();
const ZERO_QUAT = quat.create();

export default class Transform implements Component, Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'transform' = 'transform';
  static componentType: {| 'transform': Transform |};
  static networkable = true;
  static memory: SharedArrayBuffer;

  translation: Vec3;
  rotation: Quat;
  parent: ?Entity;
  offset: number;

  constructor(translation: Vec3 = ZERO_VECTOR, rotation: Quat = ZERO_QUAT, parent?: Entity, offset: number) {
    const mem = new Int32Array(Transform.memory);
    if (!offset) {
      mem[0] += 8 * 3 + 8 * 4;
    }
    this.offset = offset || mem[0];

    this.translation = new Float64Array(Transform.memory, this.offset, 3)
    this.rotation = new Float64Array(Transform.memory, this.offset+ 8 * 3, 4)

    vec3.copy(this.translation, translation);
    quat.copy(this.rotation, rotation);

    this.parent = parent;
  }

  static deserialize(data: Transform): Transform {
    const res = new Transform(data.translation, data.rotation);
    return res;
  }

  serialize(): mixed {
    return {
      translation: Array.from(this.translation),
      rotation: Array.from(this.rotation),
    };
  }
}

Transform.memory = new ArrayBuffer(1024 * 1024)

export type TransformProps = {|
  translation?: Vec3, parent?: Entity, rotation?: Quat
|};


/**
 * Contains positional data, such as coordinates and rotation
 * @param {Vec3} translation 3D world coordinates
 * @param {Entity} parent parent object in hierarchy
 */
export const TransformComponent = ({
  translation, parent, rotation,
}: TransformProps) =>
  // $FlowFixMe
  new Transform(translation, rotation, parent);
