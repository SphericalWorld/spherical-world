// @flow strict
import type { Vec3 } from 'gl-matrix';
import type { RigidBody } from './RigidBody';
import type { COLLIDER_AABB_TYPE, AABB } from './colliders/AABB';
import { collisionCheckers, collisionManifoldGenerators } from './colliders/colliders';

export type COLLIDER_TYPE =
  | COLLIDER_AABB_TYPE;

export type Collider =
  | AABB;

export const collide = (a: RigidBody, b: RigidBody) =>
  collisionManifoldGenerators[a.shape.type][b.shape.type](a, b);

export const testCollision = (a: Collider, b: Collider) => collisionCheckers[a.type][b.type](a, b);

export const move = (a: Collider, translation: Vec3): void => {
  a.move(translation);
};
