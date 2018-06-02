// @flow
import { System } from '../../systems/System';
import { World } from '../../ecs';
import Velocity from '../../components/Velocity';
import Transform from '../../components/Transform';
import Physics from '../../components/Physics';
import { Terrain } from '../Terrain';
import { Chunk as IChunk } from '../Terrain/Chunk';
import { CHUNK_STATUS_NEED_LOAD_ALL } from '../../Terrain/Chunk/chunkConstants';
import { getGeoId } from '../../../../common/chunk';

const physicsSystemProvider = (ecs: World, terrain: Terrain, Chunk: typeof IChunk) => {
  class PhysicsSystem implements System {
    world: World;
    components: [string, Transform, Velocity][] = ecs.createSelector([Transform, Velocity, Physics]);

    update(delta: number): Array {
      const result = [];
      for (const [id, position, velocity] of this.components) {
        this.calculateMovement(position, velocity);
        result.push([id, position, velocity]);
        // console.log(position)
      }
      return result;
    }

    calculateMovement({ translation }: Transform, velocity: Velocity) {
      const chunk = terrain.chunks.get(getGeoId(Math.floor(translation[0] / 16) * 16, Math.floor(translation[2] / 16) * 16));
      // console.log(chunk)
      // console.log(getGeoId(Math.floor(position.x / 16) * 16, Math.floor(position.z / 16) * 16))
      if (!chunk) {
        return;
      }

      if (chunk.state !== CHUNK_STATUS_NEED_LOAD_ALL) {
        const blockX = Math.floor(translation[0] % 16);
        const blockZ = Math.floor(translation[2] % 16);
        if (chunk.getBlock(blockX, Math.floor(translation[1]), blockZ) || 0) {
          translation[1] = Math.floor(translation[1] + 1);
          velocity.linear[1] = 0;
          return;
        }
      }

      // translation[1] += velocity.linear[1];
    }
  }

  return PhysicsSystem;
};

export default physicsSystemProvider;
