import { vec3 } from 'gl-matrix';
import type { System } from '../../common/ecs/System';
import { Transform, BlockRemover, Player, Visual, Raytracer, Joint } from '../components';
import { getGeoId } from '../../common/chunk';
import { ClientToServerMessage } from '../../common/protocol';
import { WorldMainThread, GameEvent } from '../Events';
import type Network from '../network';
import { blocksInfo } from '../blocks/blocksInfo';
import { InputAction } from '../Input/InputAction';
import { InputEvent } from '../../common/constants/input/eventTypes';
// import { Sound } from '../Sound';

// import woodHit from '../sounds/wood_hit.wav';

// const blockRemoveSound = new Sound({ src: woodHit });

const getPutBlockEvents = (world: WorldMainThread, network: Network, picker) => {
  InputAction.on(InputEvent.playerPutBlock, () => {
    const { emptyBlock, face, hasEmptyBlock } = picker[0].raytracer;
    if (hasEmptyBlock) {
      const inventory = world.objects.get(picker[0].transform.parent).inventory.data;
      const item = inventory.items[inventory.selectedItem];
      if (!item || !item.count) {
        return;
      }
      item.count -= 1;
      if (!item.count) {
        const { [inventory.selectedItem]: toRemove, ...newItems } = inventory.items;
        inventory.items = newItems;
      } else {
        inventory.items = { ...inventory.items };
      }
      network.emit({
        type: ClientToServerMessage.playerPutBlock,
        data: {
          flags: face,
          geoId: getGeoId(emptyBlock.coordinates[0], emptyBlock.coordinates[1]),
          position: Array.from(emptyBlock.position),
          positionInChunk: Array.from(emptyBlock.positionInChunk),
          blockId: item.itemTypeId,
          itemId: item.id,
        },
      });
      world.dispatch({
        type: GameEvent.playerPutBlock,
        payload: {
          flags: face,
          geoId: getGeoId(emptyBlock.coordinates[0], emptyBlock.coordinates[1]),
          position: [emptyBlock.position[0], emptyBlock.position[1], emptyBlock.position[2]],
          positionInChunk: [
            emptyBlock.positionInChunk[0],
            emptyBlock.positionInChunk[1],
            emptyBlock.positionInChunk[2],
          ],
          blockId: item.itemTypeId,
          itemId: item.id,
        },
      });
    }
  });
};

export default (world: WorldMainThread, network: Network): System => {
  const removers = world.createSelector([Transform, BlockRemover, Visual, Joint]);
  const picker = world.createSelector([Transform, Player, Raytracer, Visual]);

  getPutBlockEvents(world, network, picker);

  const raytracerRegistry = world.components.get('raytracer');
  if (!raytracerRegistry) {
    throw new Error();
  }

  const blockRemove = (delta: number) => {
    for (const { visual, blockRemover, id, joint } of removers) {
      if (!joint.raytracer) {
        joint.raytracer = raytracerRegistry.get(joint.parent);
      }
      const { block } = joint.raytracer;
      if (id === id) {
        // TODO: main player ID
        const { removing } = blockRemover;
        blockRemover.removing = InputAction.isActive(InputEvent.playerAttack);
        if (removing !== blockRemover.removing) {
          network.emit({
            type: ClientToServerMessage.playerStartedDestroyingBlock,
            data: block.position,
          });
        }
      }
      if (
        blockRemover.removing &&
        block.block &&
        vec3.exactEquals(block.position, blockRemover.position)
      ) {
        // blockRemoveSound.audioData.play();
        visual.enabled = true;
        blockRemover.removedPart += (1 / blocksInfo[block.block].baseRemoveTime) * delta;
        if (blockRemover.removedPart >= 1) {
          blockRemover.removedPart = 0;
          world.dispatch({
            type: GameEvent.playerDestroyedBlock,
            payload: {
              geoId: getGeoId(block.coordinates[0], block.coordinates[1]),
              positionInChunk: Array.from(block.positionInChunk),
              position: Array.from(block.position),
            },
          });
          network.emit({
            type: ClientToServerMessage.playerDestroyedBlock,
            data: {
              geoId: getGeoId(block.coordinates[0], block.coordinates[1]),
              positionInChunk: [
                block.positionInChunk[0],
                block.positionInChunk[1],
                block.positionInChunk[2],
              ],
              position: [block.position[0], block.position[1], block.position[2]],
            },
          });
        }
      } else {
        visual.enabled = false;
        blockRemover.removedPart = 0;
      }
      blockRemover.position = block.position;
      const maxFrames = visual.glObject.material.diffuse.frames;
      visual.glObject.material.frame = Math.floor(maxFrames * blockRemover.removedPart);
    }
    for (const { visual, raytracer } of picker) {
      visual.enabled = !!raytracer.block.block;
    }
  };
  return blockRemove;
};
