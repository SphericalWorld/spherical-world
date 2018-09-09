// @flow
import type { Terrain } from '../Terrain';
import type { Component } from '../../components/Component';
import type { Entity } from '../../ecs/Entity';
import type { System } from '../../systems/System';
import type { World } from '../../ecs';
import { PLAYER_DESTROYED_BLOCK, PLAYER_PUT_BLOCK } from '../../player/events';
import { CHUNK_LOADED } from '../../Terrain/terrainConstants';

const blockRemoveObserver = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === PLAYER_DESTROYED_BLOCK && el)
  .map(el => el.payload)
  .subscribe(({
    geoId, x, y, z,
  }) => terrain.chunks
    .get(geoId)
    .map(chunk => chunk.removeBlock(x, y, z)));

const blockPutObserver = (ecs: World, terrain: Terrain) => ecs.events
  .filter(e => e.type === PLAYER_PUT_BLOCK)
  .map(e => e.payload)
  .subscribe(({
    geoId, x, y, z, blockId, face,
  }) => terrain.chunks
    .get(geoId)
    .map(chunk => chunk.putBlock(x, y, z, blockId, face)));

const onChunkAdd = (ecs: World, terrain: Terrain) => ecs.events
  .filter(el => el.type === CHUNK_LOADED && el)
  .subscribe(({ payload: { x, z, data } }) => terrain.loadChunk(x, z, data));

export default (ecs: World, terrain: Terrain) =>
  class TerrainSystem implements System {
    blockRemoveEvents = blockRemoveObserver(ecs, terrain);
    blockPutEvents = blockPutObserver(ecs, terrain);
    onChunkAdd = onChunkAdd(ecs, terrain);

    update(delta: number): (Entity | Component)[][] {
      // console.log(delta)
    }
  };
