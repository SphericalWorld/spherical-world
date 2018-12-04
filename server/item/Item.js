// @flow
import type { Vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type World from '../../common/ecs/World';

import Transform from '../components/Transform';
import NetworkSync from '../components/NetworkSync';

const createItem = (
  world: World,
) => (id: ?Entity, position: Vec3) => {
  const player = world.createEntity(
    id,
    new NetworkSync({ name: 'item' }),
    new Transform(position[0], position[1], position[2]),
  );
  return player;
};

export type CreateItem = $Call<typeof createItem, *>;
export default createItem;
