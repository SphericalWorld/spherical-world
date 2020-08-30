import { quat } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import Transform from '../components/Transform';
import Item from '../components/Item';
import type { WorldMainThread } from '../Events';

const ROTATION_SPEED = 1;

export default (world: WorldMainThread): System => {
  const dropableItems = world.createSelector([Transform, Item]);

  return (delta: number) => {
    for (const { transform } of dropableItems) {
      quat.rotateY(transform.rotation, transform.rotation, delta * ROTATION_SPEED);
    }
  };
};
