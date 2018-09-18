// @flow
import type { Terrain } from '../Terrain';
import type { System, UpdatedComponents } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import { CHUNK_LOADED } from '../../Terrain/terrainConstants';

const onChunkAdd = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === CHUNK_LOADED && el)
  .subscribe(({ payload: { x, z, data } }) => terrain.loadChunk(x, z, data));

export default (ecs: World, terrain: Terrain) =>
  class TerrainSystem implements System {
    onChunkAdd = onChunkAdd(ecs, terrain);

    update(delta: number): ?UpdatedComponents {
      // console.log(delta)
    }
  };
