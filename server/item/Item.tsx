import type { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type { World } from '../../common/ecs/World';
import type { Slot } from '../../common/Inventory';
import { Transform, NetworkSync, Item, Inventory } from '../components';
import { React, GameObject, render } from '../../common/ecs';

const createItem = (world: World) => (id: Entity | null, position: vec3, slot: Slot) => {
  return render(
    () => (
      <GameObject id={id}>
        <NetworkSync name="ITEM" />
        <Transform translation={position} />
        <Item />
        <Inventory slots={[]} items={{ slot }} />
      </GameObject>
    ),
    world,
  );
};

export const deserializeItem = (world: World) => ({
  id,
  transform,
  inventory,
}: {
  id: Entity;
  transform: Transform;
  inventory: Inventory;
}) => {
  render(
    () => (
      <GameObject id={id}>
        <NetworkSync name="ITEM" />
        <Transform {...transform} />
        <Item />
        <Inventory {...inventory.data} />
      </GameObject>
    ),
    world,
  );
};

export type CreateItem = ReturnType<typeof createItem>;
export default createItem;
