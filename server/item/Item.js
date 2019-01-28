// @flow strict
import type { Vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type World from '../../common/ecs/World';
import { type Slot } from '../../common/Inventory';
import {
  Transform,
  NetworkSync,
  Item,
  Inventory,
} from '../components';

const createItem = (
  world: World,
) => (id: Entity | null, position: Vec3, slot: Slot) => {
  const player = world.createEntity(
    id,
    new NetworkSync({ name: 'ITEM' }),
    new Transform(position),
    new Item(),
    new Inventory({
      slots: [],
      items: {
        slot,
      },
    }),
  );
  return player;
};

export const deserializeItem = (
  world: World,
) => ({ id, transform, inventory }: {id: Entity, transform: Transform, inventory: Inventory}) => {
  const player = world.createEntity(
    id,
    new NetworkSync({ name: 'ITEM' }),
    Transform.deserialize(transform),
    new Item(),
    Inventory.deserialize(inventory),
  );
  return player;
};

export type CreateItem = $Call<typeof createItem, *>;
export default createItem;
