// @flow
import type World from '../ecs/World';
import type { Entity } from '../ecs/Entity';
import GameEventQueue from '../GameEvent/GameEventQueue';
import type { System } from './System';
import Transform from '../components/Transform';
import BlockRemover from '../components/BlockRemover';
import Visual from '../components/Visual';
import Raytracer from '../components/Raytracer';
import { playerAttackObservable, PLAYER_ATTACKED } from '../player/events';

const blockRemoverProvider = (world: World) => {
  class BlockRemove implements System {
    removers: {
      id: Entity,
      blockRemover: BlockRemover,
      visual: Visual,
      raytracer: Raytracer
    }[] = world.createSelector([Transform, BlockRemover, Visual, Raytracer]);

    moveEvents: GameEventQueue = new GameEventQueue(playerAttackObservable);

    update(delta: number): void {
      for (const {
        visual, blockRemover, raytracer, id,
      } of this.removers) {
        if (id === id) { // TODO: main player ID
          this.moveEvents.events.map((event) => {
            blockRemover.removing = event.type === PLAYER_ATTACKED;
          });
        }
        const maxFrames = visual.glObject.material.diffuse.frames;
        if (raytracer.block.block && blockRemover.removing) {
          visual.enabled = true;
          blockRemover.removedPart += 0.01;
          if (blockRemover.removedPart >= 1) {
            blockRemover.removedPart = 0;
          }
        } else {
          visual.enabled = false;
          blockRemover.removedPart = 0;
        }
        visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
      }
      this.moveEvents.clear();
    }
  }

  return BlockRemove;
};

export default blockRemoverProvider;
