// @flow
import type Network from '../network';
import type { Terrain } from '../Terrain/Terrain';
import type { Component } from '../components/Component';
import type { Entity } from '../ecs/Entity';
import type { System } from './System';
import type { World } from '../ecs';

import { CHUNK_LOADED } from '../Terrain/terrainConstants';

const onChunkLoaded = (ecs: World, network: Network, terrain: Terrain) => network.events
  .filter(e => e.type === 'loadChunk')
  .subscribe(({ type, payload }) => {
    terrain.loadChunk(payload.data);
    ecs.dispatch({ type: CHUNK_LOADED, payload: { data: payload.binaryData, x: payload.data.x, z: payload.data.z } });
  });

const onChunkVBOLoaded = (ecs: World, terrain: Terrain) => ecs.events
  .filter(e => e.type === 'CHUNK_VBO_LOADED')
  .map(e => e.payload)
  .subscribe((e) => {
    terrain.chunks.get(e.geoId).map((chunk) => {
      chunk.bindVBO(e.buffers, e.buffersInfo);
    })
  });

export default (ecs: World, network: Network, terrain: Terrain) =>
  class TerrainSystem implements System {
    onChunkLoaded = onChunkLoaded(ecs, network, terrain);
    onChunkVBOLoaded = onChunkVBOLoaded(ecs, terrain);

    update(delta: number): (Entity | Component)[][] {
      // console.log(delta)
    }
  };
