// @flow strict
import { vec3 } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import {
  Transform,
  Item,
  Inventory,
} from '../components';

export default (world: World): System => {
  const dropableItems = world.createSelector([Transform, Item]);
  const players = world.createSelector([Transform, Inventory]);
  const dropableSystem = () =>
    players.map(({ id, transform, inventory }) => {
      const item = dropableItems.find(
        ({ transform: { translation } }) => vec3.distance(translation, transform.translation) < 1,
      );
      if (item) {
        world.deleteEntity(item.id);
      }
      return [id, transform, inventory];
    });
  return dropableSystem;
};
