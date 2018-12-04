// @flow
import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import GlObject from '../engine/glObject';
import { World } from '../../common/ecs';
import {
  Transform, Visual, Collider, Physics, Velocity, Gravity,
} from '../components';
import { createCube } from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';

const SIZE = 0.2;

const createItem = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => (id: Entity, { transform }: { transform: Transform }): Entity => {
  const model = createCube(SIZE);
  const material = materialLibrary.get('skybox');
  const object = new GlObject({ model, material });
  const picker = ecs.createEntity(
    id,
    Transform.deserialize(transform),
    new Visual(object),
    new Collider(
      COLLIDER_AABB,
      vec3.create(),
      vec3.fromValues(SIZE, SIZE, SIZE),
    ),
    new Physics(),
    new Velocity(),
    new Gravity(),
  );
  return picker.id;
};

export default createItem;
