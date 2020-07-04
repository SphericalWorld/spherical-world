import { vec3 } from 'gl-matrix';
import createManifold from '../Manifold';
import type { Manifold } from '../Manifold';
import type { RigidBody } from '../RigidBody';
import type { COLLIDER_TYPE } from '../Collider';

export type COLLIDER_AABB_TYPE = 0;
export const COLLIDER_AABB: COLLIDER_AABB_TYPE = 0;

class AABBinner {
  toMin: vec3;
  toMax: vec3;
  min: vec3;
  max: vec3;
  size: vec3;
  halfSize: vec3;
  center: vec3;
  objectPosition: vec3;
  type: COLLIDER_TYPE;

  constructor(translation: vec3, size: vec3, objectPosition?: vec3) {
    this.type = COLLIDER_AABB;
    this.size = size;
    this.center = translation;
    this.halfSize = vec3.scale(vec3.create(), size, 0.5);
    this.objectPosition = objectPosition || this.halfSize;
    this.toMin = vec3.sub(vec3.create(), vec3.create(), this.objectPosition);
    this.toMax = vec3.sub(vec3.create(), size, this.objectPosition);
    this.min = vec3.add(vec3.create(), translation, this.toMin);
    this.max = vec3.add(vec3.create(), translation, this.toMax);
  }

  move(translation: vec3) {
    vec3.add(this.min, translation, this.toMin);
    vec3.add(this.max, translation, this.toMax);
    vec3.copy(this.center, vec3.add(vec3.create(), this.min, this.halfSize));
  }
}

export type AABB = {
  min: vec3;
  max: vec3;
  size: vec3;
  halfSize: vec3;
  center: vec3;
  type: COLLIDER_TYPE;
  move: (position: vec3) => void;
};

export const createAABB = (translation: vec3, size: vec3, objectPosition?: vec3): AABB =>
  new AABBinner(translation, size, objectPosition);

export const testAABBvsAABB = (a: AABB, b: AABB): boolean =>
  a.min[0] < b.max[0] &&
  a.max[0] > b.min[0] &&
  a.min[1] < b.max[1] &&
  a.max[1] > b.min[1] &&
  a.min[2] < b.max[2] &&
  a.max[2] > b.min[2];

export const AABBvsAABB = (a: RigidBody, b: RigidBody): Manifold => {
  const normal = vec3.sub(vec3.create(), a.shape.center, b.shape.center);
  const xOverlap = a.shape.halfSize[0] + b.shape.halfSize[0] - Math.abs(normal[0]);
  const yOverlap = a.shape.halfSize[1] + b.shape.halfSize[1] - Math.abs(normal[1]);
  const zOverlap = a.shape.halfSize[2] + b.shape.halfSize[2] - Math.abs(normal[2]);

  if (zOverlap < yOverlap && zOverlap < xOverlap) {
    return createManifold(
      a,
      b,
      zOverlap,
      normal[2] < 0 ? vec3.set(normal, 0, 0, -1) : vec3.set(normal, 0, 0, 1),
      vec3.fromValues(1, 1, 0),
    );
  }
  if (xOverlap < yOverlap) {
    return createManifold(
      a,
      b,
      xOverlap,
      normal[0] < 0 ? vec3.set(normal, -1, 0, 0) : vec3.set(normal, 1, 0, 0),
      vec3.fromValues(0, 1, 1),
    );
  }
  return createManifold(
    a,
    b,
    yOverlap,
    normal[1] < 0 ? vec3.set(normal, 0, -1, 0) : vec3.set(normal, 0, 1, 0),
    vec3.fromValues(1, 0, 1),
  );
};
