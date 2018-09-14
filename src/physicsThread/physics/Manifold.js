// @flow
import type { Vec3 } from 'gl-matrix';
import type { RigidBody } from './RigidBody';

export type Manifold = {
  a: RigidBody;
  b: RigidBody;
  penetration: number;
  normal: Vec3;
};

const createManifold = (a: RigidBody, b: RigidBody, penetration: number, normal: Vec3): Manifold =>
  ({
    a, b, penetration, normal,
  });

export default createManifold;
