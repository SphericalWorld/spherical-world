// @flow
import { vec3 } from 'gl-matrix';
import type World from '../ecs/World';
import { blocksInfo } from '../blocks/blockInfo';
import type { System } from './System';
import Transform from '../components/Transform';
import BlockRemover from '../components/BlockRemover';
import Visual from '../components/Visual';
import Raytracer from '../components/Raytracer';
import {
  PLAYER_ATTACKED,
  PLAYER_STARTED_DESTROYING_BLOCK,
  PLAYER_STOPED_ATTACK,
  PLAYER_DESTROYED_BLOCK,
} from '../player/events';

const getPlayerAttackEvents = (world: World) => world.events
  .filter(e => e.type === PLAYER_ATTACKED || e.type === PLAYER_STOPED_ATTACK)
  .map(e => e.type === PLAYER_ATTACKED)
  .subscribeQueue();

export default (world: World) =>
  class BlockRemove implements System {
    removers = world.createSelector([Transform, BlockRemover, Visual, Raytracer]);
    playerAttackEvents = getPlayerAttackEvents(world);

    update(delta: number): void {
      for (const {
        visual, blockRemover, raytracer: { block }, id,
      } of this.removers) {
        if (id === id) { // TODO: main player ID
          const { removing } = blockRemover;
          this.playerAttackEvents.events.forEach((possibleRemoving) => {
            blockRemover.removing = possibleRemoving;
          });
          if (removing !== blockRemover.removing) {
            world.createEventAndDispatch(PLAYER_STARTED_DESTROYING_BLOCK, block.position, true);
          }
        }
        if (blockRemover.removing && block.block && vec3.exactEquals(block.position, blockRemover.position)) {
          visual.enabled = true;
          blockRemover.removedPart += (1 / blocksInfo[block.block].baseRemoveTime) * delta;
          if (blockRemover.removedPart >= 1) {
            world.createEventAndDispatch(PLAYER_DESTROYED_BLOCK, {
              geoId: block.geoId, ...block.positionInChunk,
            }, true);
          }
        } else {
          visual.enabled = false;
          blockRemover.removedPart = 0;
        }
        blockRemover.position = block.position;
        const maxFrames = visual.glObject.material.diffuse.frames;
        visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
      }
      this.playerAttackEvents.clear();
    }
  };
