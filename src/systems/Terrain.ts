import { vec3 } from 'gl-matrix';
import type Network from '../network';
import type Terrain from '../Terrain/Terrain';
import type { System } from '../../common/ecs/System';
import type { World } from '../../common/ecs';
import { filterFarChunks } from '../../common/chunk';
import Camera from '../components/Camera';
import Transform from '../components/Transform';
import { CHUNK_LOADED } from '../Terrain/terrainConstants';

const onChunkLoaded = (ecs: World, network: Network, terrain: Terrain) =>
  network.events
    .filter((e) => e.type === 'loadChunk')
    .subscribe(({ type, payload }) => {
      const data = new SharedArrayBuffer(payload.binaryData.byteLength); // eslint-disable-line no-undef
      const viewOld = new Uint8Array(payload.binaryData);
      const viewNew = new Uint8Array(data);

      for (let i = 0; i < payload.binaryData.byteLength; i += 1) {
        viewNew[i] = viewOld[i];
      }

      const lightData = new SharedArrayBuffer(payload.binaryData.byteLength * 2); // eslint-disable-line no-undef
      // console.log(data, viewNew)
      terrain.loadChunk(data, lightData, payload.data);
      ecs.createEventAndDispatch(CHUNK_LOADED, {
        data,
        lightData,
        x: payload.data.x,
        z: payload.data.z,
      });
    });

const onChunkVBOLoaded = (ecs: World, terrain: Terrain) =>
  ecs.events
    .filter((e) => e.type === 'CHUNK_VBO_LOADED')
    .map((e) => e.payload)
    .subscribe((e) => {
      const chunk = terrain.chunks.get(e.geoId);
      if (chunk) {
        chunk.bindVBO(e.buffers, e.buffersInfo, e.subchunk, e.hasData);
      }
    });

export default (ecs: World, network: Network, terrain: Terrain): System => {
  onChunkLoaded(ecs, network, terrain);
  onChunkVBOLoaded(ecs, terrain);
  const player = ecs.createSelector([Transform, Camera]);

  const oldPosition: vec3 = vec3.create();

  const terrainSystem = () => {
    const [{ transform }] = player;
    terrain.chunks = filterFarChunks(oldPosition, transform.translation, terrain.chunks);
    vec3.copy(oldPosition, transform.translation);
  };
  return terrainSystem;
};
