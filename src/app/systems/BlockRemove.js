// @flow
import type World from '../ecs/World';
import type { Entity } from '../ecs/Entity';
import type { System } from './System';
import Transform from '../components/Transform';
import BlockRemover from '../components/BlockRemover';
import Visual from '../components/Visual';
import Raytracer from '../components/Raytracer';

const blockRemoverProvider = (world: World) => {
  class BlockRemove implements System {
    removers: {
      id: Entity,
      blockRemover: BlockRemover,
      visual: Visual,
      raytracer: Raytracer
    }[] = world.createSelector([Transform, BlockRemover, Visual, Raytracer]);

    update(delta: number): void {
      for (const { visual, blockRemover, raytracer } of this.removers) {
        // console.log(raytracer.block)
        const maxFrames = visual.glObject.material.diffuse.frames;
        if (raytracer.block.block) {
          visual.enabled = true;
          blockRemover.removedPart += 0.01;
          if (blockRemover.removedPart >= 1) {
            blockRemover.removedPart = 0;
          }
        } else {
          visual.enabled = false;
        }
        visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
      }
      // return [[id, skybox]];
    }
  }

  return BlockRemove;
};

export default blockRemoverProvider;
