import type { vec3 } from 'gl-matrix';
import type { RigidBody } from './RigidBody';

export type Manifold = Readonly<{
  a: RigidBody;
  b: RigidBody;
  penetration: number;
  normal: vec3;
  inversedNormal: vec3;
}>;

const createManifold = (
  a: RigidBody,
  b: RigidBody,
  penetration: number,
  normal: vec3,
  inversedNormal: vec3,
): Manifold => ({
  a,
  b,
  penetration,
  normal,
  inversedNormal,
});

export default createManifold;
