// @flow
import { vec3 } from 'gl-matrix';
import type World from '../ecs/World';
import { blocksInfo } from '../blocks/blockInfo';
import type { System } from './System';
import {
  Transform,
  BlockRemover,
  Player,
  Visual,
  Raytracer,
  Joint,
} from '../components';
import {
  PLAYER_ATTACKED,
  PLAYER_STARTED_DESTROYING_BLOCK,
  PLAYER_STOPED_ATTACK,
  PLAYER_DESTROYED_BLOCK,
  PLAYER_START_PUT_BLOCK,
  PLAYER_PUT_BLOCK,
} from '../player/events';

const getPutBlockEvents = (world: World, picker) => world.events
  .filter(e => e.type === PLAYER_START_PUT_BLOCK)
  .subscribe(() => {
    const { emptyBlock, face } = picker[0].raytracer;
    if (emptyBlock) {
      world.createEventAndDispatch(PLAYER_PUT_BLOCK, {
        flags: face,
        geoId: emptyBlock.geoId,
        x: emptyBlock.positionInChunk.x,
        y: emptyBlock.positionInChunk.y,
        z: emptyBlock.positionInChunk.z,
        blockId: 128,
      }, true);
    }
  });

const getPlayerAttackEvents = (world: World) => world.events
  .filter(e => e.type === PLAYER_ATTACKED || e.type === PLAYER_STOPED_ATTACK)
  .map(e => e.type === PLAYER_ATTACKED)
  .subscribeQueue();

export default (world: World) =>
  class BlockRemove implements System {
    removers = world.createSelector([Transform, BlockRemover, Visual, Joint]);
    picker = world.createSelector([Transform, Player, Raytracer, Visual]);

    playerAttackEvents = getPlayerAttackEvents(world);
    playerPutBlockEvents = getPutBlockEvents(world, this.picker);

    raytracerRegistry = world.components.get('Raytracer');

    update(delta: number): void {
      for (const {
        visual, blockRemover, id, joint,
      } of this.removers) {
        if (!joint.raytracer) {
          joint.raytracer = this.raytracerRegistry.get(joint.parent);
        }
        const { block } = joint.raytracer;
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
      for (const { visual, raytracer } of this.picker) {
        visual.enabled = !!raytracer.block.block;
      }
      this.playerAttackEvents.clear();
    }
  };
