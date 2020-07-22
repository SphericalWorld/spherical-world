import { vec3 } from 'gl-matrix';
import { toChunkPosition, toPositionInChunk } from '../../../common/chunk';
import { blocksFlags, HAS_PHYSICS_MODEL } from '../../blocks/blockInfo';
import Collider from '../../components/Collider';
import Joint from '../../components/Joint';
import type { System } from '../../../common/ecs/System';
import { World } from '../../../common/ecs';
import Velocity from '../../components/Velocity';
import Transform from '../../components/Transform';
import Physics from '../../components/Physics';
import { createAABB } from '../physics/colliders/AABB';
import { collide, testCollision, move } from '../physics/Collider';
import Terrain from '../Terrain';
import { CHUNK_STATUS_NEED_LOAD_ALL } from '../../Terrain/Chunk/chunkConstants';

const oneVector = vec3.fromValues(1, 1, 1);

const isChunkNotLoaded = (chunk) => chunk.state === CHUNK_STATUS_NEED_LOAD_ALL;

const calculateMovement = (terrain: Terrain) => {
  const blockAABB = createAABB(vec3.create(), oneVector);
  return (
    { translation }: Transform,
    velocity: Velocity,
    blockPosition: vec3,
    collider: Collider,
  ) => {
    const chunk = terrain.getChunk(
      toChunkPosition(blockPosition[0]),
      toChunkPosition(blockPosition[2]),
    );
    if (!chunk || isChunkNotLoaded(chunk)) return;
    const block = chunk.getBlock(
      toPositionInChunk(blockPosition[0]),
      Math.floor(blockPosition[1]),
      toPositionInChunk(blockPosition[2]),
    );
    if (!blocksFlags[block][HAS_PHYSICS_MODEL]) return;
    blockAABB.move(blockPosition);
    if (testCollision(collider.shape, blockAABB)) {
      const manifold = collide(
        {
          shape: collider.shape,
        },
        {
          shape: blockAABB,
        },
      );
      vec3.scaleAndAdd(translation, translation, manifold.normal, manifold.penetration);
      move(collider.shape, translation);
      vec3.mul(velocity.linear, velocity.linear, manifold.inversedNormal);
    }
  };
};

const collideWithTerrain = (terrain: Terrain) => {
  const calculate = calculateMovement(terrain);
  return (transform: Transform, velocity: Velocity, collider: Collider) => {
    const fromX = Math.floor(collider.shape.min[0]);
    const fromY = Math.floor(collider.shape.min[1]);
    const fromZ = Math.floor(collider.shape.min[2]);
    const toX = Math.floor(collider.shape.max[0]);
    const toY = Math.floor(collider.shape.max[1]);
    const toZ = Math.floor(collider.shape.max[2]);
    for (let x = fromX; x <= toX; x += 1) {
      for (let z = fromZ; z <= toZ; z += 1) {
        calculate(transform, velocity, vec3.fromValues(x, fromY, z), collider);
        calculate(transform, velocity, vec3.fromValues(x, toY, z), collider);
      }
    }
    for (let x = fromX; x <= toX; x += 1) {
      for (let y = fromY; y <= toY; y += 1) {
        calculate(transform, velocity, vec3.fromValues(x, y, fromZ), collider);
        calculate(transform, velocity, vec3.fromValues(x, y, toZ), collider);
      }
    }
    for (let z = fromZ; z <= toZ; z += 1) {
      for (let y = fromY; y <= toY; y += 1) {
        calculate(transform, velocity, vec3.fromValues(fromX, y, z), collider);
        calculate(transform, velocity, vec3.fromValues(toX, y, z), collider);
      }
    }
  };
};

export default (ecs: World, terrain: Terrain): System => {
  const components = ecs.createSelector([Transform, Velocity, Physics, Collider], [Joint]);
  const dependentComponents = ecs.createSelector([Transform, Joint]);
  const collideWithTerrainPApplied = collideWithTerrain(terrain);
  const transformRegistry = ecs.components.get('transform');

  return (delta: number) => {
    for (const { transform, velocity, collider } of components) {
      move(collider.shape, transform.translation);
      collideWithTerrainPApplied(transform, velocity, collider);
    }
    for (const { joint, transform } of dependentComponents) {
      if (!joint.parentTransform) {
        joint.parentTransform = transformRegistry.get(joint.parent);
      }
      vec3.add(transform.translation, joint.parentTransform.translation, joint.distance);
    }
  };
};
