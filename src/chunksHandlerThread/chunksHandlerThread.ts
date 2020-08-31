import EventObservable from '../../common/GameEvent/EventObservable';
import { THREAD_CHUNK_HANDLER } from '../Thread/threadConstants';
import Terrain from './Terrain';
import Thread from '../Thread';
import Chunk from './Terrain/Chunk';
import { ChunkHandlerThreadEvents, GameEvent } from '../Events';

// eslint-disable-next-line no-restricted-globals
const thread = new Thread(THREAD_CHUNK_HANDLER, self);

const terrain = new Terrain();

const events: EventObservable<ChunkHandlerThreadEvents> = new EventObservable();

thread.events
  .filter((e) => e.type === 'UPDATE_COMPONENTS' && e.payload.events)
  .subscribe(({ payload: data }) => {
    for (let i = 0; i < data.events.length; i += 1) {
      events.emit(data.events[i]);
    }
  });

events
  .filter((e) => e.type === GameEvent.chunkLoaded && e)
  .subscribe(({ payload: data }) => {
    const chunk = terrain.addChunk(
      new Chunk(data.data, data.lightData, data.flagsData, data.x, data.z),
    );
    chunk.prepareLight();
    chunk.updateState();
  });

// TODO: combine place and remove
events
  .filter((e) => e.type === GameEvent.playerDestroyedBlock && e)
  .map((e) => e.payload)
  .subscribe(({ geoId, positionInChunk: [x, y, z] }) => {
    const chunk = terrain.chunks.get(geoId);
    if (chunk) {
      chunk.removeBlock(x, y, z);
      chunk.updateState();
    }
  });

events
  .filter((e) => e.type === GameEvent.playerPutBlock && e)
  .map((e) => e.payload)
  .subscribe(({ geoId, positionInChunk: [x, y, z], blockId, flags }) => {
    const chunk = terrain.chunks.get(geoId);
    if (chunk) {
      chunk.putBlock(x, y, z, blockId, flags);
      chunk.light[x + z * 16 + y * 256] = (chunk.light[x + z * 16 + y * 256] & 0x000f) | 0xfd20;

      chunk.calcRecursionRed(x, y, z);
      chunk.calcRecursionGreen(x, y, z);
      chunk.calcRecursionBlue(x, y, z);

      chunk.updateState();
    }
  });
