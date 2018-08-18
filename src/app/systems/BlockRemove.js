// @flow
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
  .filter(el => el.type === PLAYER_ATTACKED || el.type === PLAYER_STOPED_ATTACK)
  .map(el => el.type === PLAYER_ATTACKED)
  .subscribeQueue();

export default (world: World) =>
  class BlockRemove implements System {
    removers = world.createSelector([Transform, BlockRemover, Visual, Raytracer]);
    playerAttackEvents = getPlayerAttackEvents(world);

    update(delta: number): void {
      for (const {
        visual, blockRemover, raytracer, id,
      } of this.removers) {
        if (id === id) { // TODO: main player ID
          const { removing } = blockRemover;
          this.playerAttackEvents.events.forEach((possibleRemoving) => {
            blockRemover.removing = possibleRemoving;
          });
          if (removing !== blockRemover.removing) {
            world.dispatch({
              type: PLAYER_STARTED_DESTROYING_BLOCK,
              payload: raytracer.block.position,
              network: true,
            });
          }
        }
        const maxFrames = visual.glObject.material.diffuse.frames;
        if (raytracer.block.block && blockRemover.removing) {
          visual.enabled = true;
          if (blockRemover.removedPart < 1) {
            blockRemover.removedPart += (1 / blocksInfo[raytracer.block.block].baseRemoveTime) * delta;
          } else {
            blockRemover.removedPart = 0;
            world.dispatch({
              type: PLAYER_DESTROYED_BLOCK,
              payload: {
                geoId: raytracer.block.geoId, ...raytracer.block.positionInChunk
              },
              network: true,
            });
          }
        } else {
          visual.enabled = false;
          blockRemover.removedPart = 0;
        }
        visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
      }
      this.playerAttackEvents.clear();
    }
  };
