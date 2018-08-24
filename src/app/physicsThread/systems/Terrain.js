// @flow
import type { Terrain } from '../Terrain';
import type { Component } from '../../components/Component';
import type { Entity } from '../../ecs/Entity';
import type { System } from '../../systems/System';
import type { World } from '../../ecs';
import { PLAYER_DESTROYED_BLOCK } from '../../player/events';
import { CHUNK_LOADED } from '../../Terrain/terrainConstants';


const blockRemoveObserver = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === PLAYER_DESTROYED_BLOCK && el)
  .map(el => el.payload)
  .subscribe(({
    geoId, x, y, z,
  }) => terrain.chunks
    .get(geoId)
    .map(chunk => chunk.setBlock(x, y, z, 0)));

const onChunkAdd = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === CHUNK_LOADED && el)
  .subscribe(({ payload: { x, z, data } }) => terrain.loadChunk(x, z, data));

export default (ecs: World, terrain: Terrain) =>
  class TerrainSystem implements System {
    blockRemoveEvents = blockRemoveObserver(ecs, terrain)
    onChunkAdd = onChunkAdd(ecs, terrain)

    update(delta: number): (Entity | Component)[][] {
      // console.log(delta)
    }
  };
