// @flow strict
import type { Terrain } from '../Terrain';
import type { System } from '../../../common/ecs/System';
import type { World } from '../../../common/ecs';
import { CHUNK_LOADED } from '../../Terrain/terrainConstants';

const onChunkAdd = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === CHUNK_LOADED && el)
  .subscribe(({ payload: { x, z, data } }) => terrain.loadChunk(x, z, data));

export default (ecs: World, terrain: Terrain): System => {
  onChunkAdd(ecs, terrain);

  const terrainSystem = (delta: number) => {
    // console.log(delta)
  };
  return terrainSystem;
};
