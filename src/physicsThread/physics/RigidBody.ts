import { vec3 } from 'gl-matrix';
import type { Collider } from './Collider';

export class RigidBody {
  translation: vec3;
  shape: Collider;

  moveToPosition(position: vec3) {
    vec3.copy(this.translation, position);
  }

  constructor(shape: Collider) {
    this.shape = shape;
  }
}
