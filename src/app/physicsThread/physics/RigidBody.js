// @flow
import type { Vec3 } from 'gl-matrix';
import type { Collider } from './Collider';
import { vec3 } from 'gl-matrix';

export class RigidBody {
  translation: Vec3;
  shape: Collider;

  moveToPosition(position: Vec3) {
    vec3.copy(this.translation, position);
  }

  constructor(shape: Collider) {
    this.shape = shape;
  }
}
