import type Terrain from '../Terrain';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import { WorldPhysicsThread, GameEvent } from '../../Events';

const onChunkAdd = (ecs: WorldPhysicsThread, terrain: Terrain) =>
  ecs.events
    .filter((e) => e.type === GameEvent.chunkLoaded && e)
    .subscribe(({ payload: { x, z, data, lightData, flagsData } }) =>
      terrain.loadChunk(x, z, data, lightData, flagsData),
    );

export default (ecs: World, terrain: Terrain): System => {
  onChunkAdd(ecs, terrain);

  const terrainSystem = () => {};
  return terrainSystem;
};
