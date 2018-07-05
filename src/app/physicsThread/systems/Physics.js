// @flow
import type { Entity } from '../../ecs/Entity';
import { blocksFlags, HAS_PHYSICS_MODEL } from '../../blocks/blockInfo';
import { System } from '../../systems/System';
import { World } from '../../ecs';
import Velocity from '../../components/Velocity';
import Transform from '../../components/Transform';
import Physics from '../../components/Physics';
import { Terrain } from '../Terrain';
import { Chunk as IChunk } from '../Terrain/Chunk';
import { CHUNK_STATUS_NEED_LOAD_ALL } from '../../Terrain/Chunk/chunkConstants';

const physicsSystemProvider = (ecs: World, terrain: Terrain, Chunk: typeof IChunk) => {
  const calculateMovement = ({ translation }: Transform, velocity: Velocity) => {
    terrain.getChunk(Math.floor(translation[0] / 16) * 16, Math.floor(translation[2] / 16) * 16).map((chunk) => {
      if (chunk.state === CHUNK_STATUS_NEED_LOAD_ALL) {
        return;
      }

      let blockX = Math.floor(translation[0] % 16);
      let blockZ = Math.floor(translation[2] % 16);
      blockX = blockX >= 0 ? blockX : blockX + 16;
      blockZ = blockZ >= 0 ? blockZ : blockZ + 16;

      const block = chunk.getBlock(blockX, Math.floor(translation[1]), blockZ);
      if (block && blocksFlags[block][HAS_PHYSICS_MODEL]) {
        translation[1] = Math.floor(translation[1] + 1);
        velocity.linear[1] = 0;
        return;
      }
    });
    // translation[1] += velocity.linear[1];
  };

  class PhysicsSystem implements System {
    world: World;
    components: {
      id: Entity,
      transform: Transform,
      velocity: Velocity,
    }[] = ecs.createSelector([Transform, Velocity, Physics]);

    update(delta: number): Array {
      const result = [];
      for (const { id, transform, velocity } of this.components) {
        calculateMovement(transform, velocity);
        result.push([id, transform, velocity]);
        // console.log(transform)
      }
      return result;
    }
  }

  return PhysicsSystem;
};

export default physicsSystemProvider;
