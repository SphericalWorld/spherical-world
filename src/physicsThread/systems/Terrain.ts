import type Terrain from '../Terrain';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import { CHUNK_LOADED } from '../../Terrain/terrainConstants';

const onChunkAdd = (ecs: World, terrain: Terrain) =>
  ecs.events
    .filter((el) => el.type === CHUNK_LOADED && el)
    .subscribe(({ payload: { x, z, data, lightData } }) =>
      terrain.loadChunk(x, z, data, lightData),
    );

export default (ecs: World, terrain: Terrain): System => {
  onChunkAdd(ecs, terrain);

  const terrainSystem = () => {};
  return terrainSystem;
};
