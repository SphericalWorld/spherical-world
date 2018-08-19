// @flow
import type { GameEvent } from '../GameEvent/GameEvent';

import EventObservable from '../GameEvent/EventObservable';
import terrainBaseProvider from '../Terrain/TerrainBase';
import { THREAD_CHUNK_HANDLER } from '../Thread/threadConstants';
import terrainProvider from './Terrain';
import Thread from '../Thread';
import Chunk from './Terrain/Chunk';

const thread = new Thread(THREAD_CHUNK_HANDLER, self);

const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(TerrainBase);
const terrain = new Terrain();

const events: EventObservable<GameEvent> = new EventObservable();

thread.events
  .filter(e => e.type === 'UPDATE_COMPONENTS' && e.payload.events)
  .subscribe(({ payload: data }) => {
    for (let i = 0; i < data.events.length; i += 1) {
      events.emit(data.events[i]);
    }
  });

events
  .filter(e => e.type === 'CHUNK_LOADED')
  .subscribe(({ payload: data }) => {
    let chunk = terrain.getChunk(data.x, data.z);
    if (chunk.isJust === false) {
      chunk = terrain.addChunk(new Chunk(terrain, data.x, data.z));
    } else {
      chunk = chunk.extract();
    }
    chunk.blocks = new Uint8Array(data.data);
    chunk.prepareLight();
    chunk.updateState();
  });

// TODO: combine place and remove
self.registerMessageHandler('TERRAIN_REMOVED_BLOCK', ({
  payload: {
    x, y, z, geoId,
  },
}) => terrain.chunks.get(geoId).map((chunk) => {
  console.log(chunk)
  chunk.removeBlock(x, y, z);
  chunk.updateState();
}));

self.registerMessageHandler('TERRAIN_PLACED_BLOCK', ({
  payload: {
    geoId, x, y, z, blockId, plane,
  },
}) => terrain.chunks.get(geoId).map((chunk) => {
  chunk.putBlock(x, y, z, blockId, plane);

  chunk.light[x + z * 16 + y * 256] = chunk.light[x + z * 16 + y * 256] & 0x000F | 0xFD20;

  chunk.calcRecursionRed(x, y, z);
  chunk.calcRecursionGreen(x, y, z);
  chunk.calcRecursionBlue(x, y, z);

  chunk.updateState();
}));

// eslint-disable-next-line
self.registerMessageHandler("TERRAIN_MIPMAP_LOADED", ({ payload }) => {
  // throw JSON.stringify(data);
  terrain.makeMipMappedTextureAtlas(payload.mipmap);
});
