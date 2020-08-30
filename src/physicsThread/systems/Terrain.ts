import type Terrain from '../Terrain';
import type { System } from '../../../common/ecs/System';
import { WorldPhysicsThread, GameEvent } from '../../Events';

const onChunkAdd = (world: WorldPhysicsThread, terrain: Terrain) =>
  world.events
    .filter((e) => e.type === GameEvent.chunkLoaded && e)
    .subscribe(({ payload: { x, z, data, lightData, flagsData } }) =>
      terrain.loadChunk(x, z, data, lightData, flagsData),
    );

export default (world: WorldPhysicsThread, terrain: Terrain): System => {
  onChunkAdd(world, terrain);

  const terrainSystem = () => {};
  return terrainSystem;
};
