import { testAABBvsAABB, AABBvsAABB } from './AABB';

type CollisionCheckers = [[typeof testAABBvsAABB]];

export const collisionCheckers: CollisionCheckers = [
  [
    testAABBvsAABB,
  ],
];

export const collisionManifoldGenerators = [
  [
    AABBvsAABB,
  ],
];
