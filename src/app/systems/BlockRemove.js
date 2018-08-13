// @flow
import type World from '../ecs/World';
import type { Entity } from '../ecs/Entity';
import { clamp } from '../../../common/utils/numberUtils';
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
} from '../player/events';

const clampAnimation = clamp(0, 0.99);

const blockRemoverProvider = (world: World) => {
  class BlockRemove implements System {
    removers: {
      id: Entity,
      blockRemover: BlockRemover,
      visual: Visual,
      raytracer: Raytracer
    }[] = world.createSelector([Transform, BlockRemover, Visual, Raytracer]);

    playerAttackEvents = world.events
      .filter(el => el.type === PLAYER_ATTACKED || el.type === PLAYER_STOPED_ATTACK)
      .map(el => el.type === PLAYER_ATTACKED)
      .subscribeQueue();

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
            blockRemover.removedPart = clampAnimation(blockRemover.removedPart + (1 / blocksInfo[raytracer.block.block].baseRemoveTime) * delta);
          }
        } else {
          visual.enabled = false;
          blockRemover.removedPart = 0;
        }
        visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
      }
      this.playerAttackEvents.clear();
    }
  }

  return BlockRemove;
};

export default blockRemoverProvider;
