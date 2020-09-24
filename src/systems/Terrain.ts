import { vec3 } from 'gl-matrix';
import type Network from '../network';
import type Terrain from '../Terrain/Terrain';
import type { System } from '../../common/ecs/System';
import { Camera, Transform } from '../components';
import { BLOCKS_IN_CHUNK } from '../../common/constants/chunk';
import { ServerToClientMessage } from '../../common/protocol';
import { WorldMainThread, GameEvent } from '../Events';

const onChunkLoaded = (world: WorldMainThread, network: Network, terrain: Terrain) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.loadChunk && e)
    .subscribe(({ binaryData, data }) => {
      const blocksData = new SharedArrayBuffer(BLOCKS_IN_CHUNK);
      const viewOld = new Uint8Array(binaryData);
      const viewNew = new Uint8Array(blocksData);

      for (let i = 0; i < BLOCKS_IN_CHUNK; i += 1) {
        viewNew[i] = viewOld[i];
      }

      const lightData = new SharedArrayBuffer(BLOCKS_IN_CHUNK * 2);
      const flagsData = new SharedArrayBuffer(BLOCKS_IN_CHUNK);

      const viewFlags = new Uint8Array(flagsData);
      for (let i = 0; i < BLOCKS_IN_CHUNK; i += 1) {
        viewFlags[i] = viewOld[BLOCKS_IN_CHUNK + i];
      }
      // console.log(data, viewNew)
      terrain.loadChunk(blocksData, lightData, flagsData, data);
      world.dispatch({
        type: GameEvent.chunkLoaded,
        payload: {
          data: blocksData,
          lightData,
          flagsData,
          x: data.x,
          z: data.z,
        },
      });
    });

const onChunkUnLoaded = (world: WorldMainThread, network: Network, terrain: Terrain) =>
  network.events
    .filter((e) => e.type === ServerToClientMessage.unloadChunk && e)
    .subscribe(({ data }) => {
      terrain.unloadChunk(data.x, data.z);
    });

const onChunkVBOLoaded = (world: WorldMainThread, terrain: Terrain) =>
  world.events
    .filter((e) => e.type === GameEvent.chunkVBOLoaded && e)
    .map((e) => e.payload)
    .subscribe((e) => {
      const chunk = terrain.chunks.get(e.geoId);
      if (chunk) {
        chunk.bindVBO(e.buffers, e.buffersInfo, e.subchunk, e.hasData);
      }
    });

export default (world: WorldMainThread, network: Network, terrain: Terrain): System => {
  onChunkLoaded(world, network, terrain);
  onChunkUnLoaded(world, network, terrain);

  onChunkVBOLoaded(world, terrain);
  const player = world.createSelector([Transform, Camera]);

  const oldPosition: vec3 = vec3.create();

  const terrainSystem = () => {
    const [{ transform }] = player;
    vec3.copy(oldPosition, transform.translation);
  };
  return terrainSystem;
};
