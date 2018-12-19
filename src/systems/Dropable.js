// @flow strict
import { quat } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import Transform from '../components/Transform';
import Item from '../components/Item';

const ROTATION_SPEED = 1;

export default (world: World): System => {
  const dropableItems = world.createSelector([Transform, Item]);

  const dropableSystem = (delta: number) =>
    dropableItems.map(({ id, transform }) => {
      quat.rotateY(transform.rotation, transform.rotation, delta * ROTATION_SPEED);
      return [id, transform];
    });
  return dropableSystem;
};
