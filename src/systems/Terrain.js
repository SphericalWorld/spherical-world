// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type Network from '../network';
import type { Terrain } from '../Terrain/Terrain';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import { filterFarChunks } from '../../common/chunk';
import Camera from '../components/Camera';
import Transform from '../components/Transform';
import { CHUNK_LOADED } from '../Terrain/terrainConstants';

const onChunkLoaded = (ecs: World, network: Network, terrain: Terrain) => network.events
  .filter(e => e.type === 'loadChunk')
  .subscribe(({ type, payload }) => {
    terrain.loadChunk(payload.data);
    ecs.createEventAndDispatch(CHUNK_LOADED, { data: payload.binaryData, x: payload.data.x, z: payload.data.z });
  });

const onChunkVBOLoaded = (ecs: World, terrain: Terrain) => ecs.events
  .filter(e => e.type === 'CHUNK_VBO_LOADED')
  .map(e => e.payload)
  .subscribe(e => terrain.chunks
    .get(e.geoId)
    .map((chunk) => {
      chunk.bindVBO(e.buffers, e.buffersInfo);
    }));

export default (ecs: World, network: Network, terrain: Terrain) =>
  class TerrainSystem implements System {
    onChunkLoaded = onChunkLoaded(ecs, network, terrain);
    onChunkVBOLoaded = onChunkVBOLoaded(ecs, terrain);
    player = ecs.createSelector([Transform, Camera]);

    oldPosition: Vec3 = vec3.create();

    update(delta: number): void {
      const [{ transform }] = this.player;
      // terrain.chunks = filterFarChunks(this.oldPosition, transform.translation, terrain.chunks);
      vec3.copy(this.oldPosition, transform.translation);
    }
  };
