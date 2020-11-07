// export { default } from '../../common/ecs/components/Transform';

import { vec3, quat } from 'gl-matrix';
import { Component } from '../../common/ecs/Component';
import type { Entity } from '../../common/ecs/Entity';
import { THREAD_MAIN, THREAD_PHYSICS } from '../../src/Thread/threadConstants';
import type { Networkable } from '../../common/Networkable';

const ZERO_VECTOR = vec3.create();
const ZERO_QUAT = quat.create();

export type TransformProps = {
  translation?: vec3;
  parent?: Entity;
  rotation?: quat;
};

/**
 * Contains positional data, such as coordinates and rotation
 * @param {vec3} translation 3D world coordinates
 * @param {Entity} parent parent object in hierarchy
 */
export class Transform extends Component<TransformProps> implements Networkable {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'transform' = 'transform';
  static networkable = true;

  readonly translation: vec3 = Component.memoryManager.getVec3();
  readonly rotation: quat = Component.memoryManager.getQuat();

  parent: Entity | null;

  constructor({ translation = ZERO_VECTOR, rotation = ZERO_QUAT, parent }: TransformProps) {
    super();

    vec3.copy(this.translation, translation);
    quat.copy(this.rotation, rotation);

    this.parent = parent;
  }

  // static deserialize(data: Transform): Transform {
  //   const res = new Transform(data);
  //   return res;
  // }

  serialize(): unknown {
    return {
      translation: Array.from(this.translation),
      rotation: Array.from(this.rotation),
    };
  }

  update(data: Transform): void {
    if (data.translation) {
      vec3.copy(this.translation, data.translation);
    }
    if (data.rotation) {
      quat.copy(this.rotation, data.rotation);
    }
  }
}
