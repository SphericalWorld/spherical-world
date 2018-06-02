// @flow
import { getGeoId } from '../Terrain/Chunk/ChunkBase';
import { CHUNK_STATUS_NEED_LOAD_VBO } from '../Terrain/Chunk/chunkConstants';
import terrainBaseProvider from '../Terrain/TerrainBase';
import terrainProvider from './Terrain';
import Thread from '../Thread';
import chunkProvider from './Terrain/Chunk';

new Thread();

const Chunk = chunkProvider(null);
const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(null, Chunk, TerrainBase);
const terrain = new Terrain();

// eslint-disable-next-line
self.registerMessageHandler('CHUNK_LOADED', ({ payload: data }) => {
  let chunk = terrain.chunks.get(getGeoId(data.x, data.z));
  if (!chunk) {
    chunk = terrain.addChunk(new Chunk(terrain, data.x, data.z));
  }
  chunk.blocksData = data.data;
  chunk.blocks = new Uint8Array(chunk.blocksData);
  chunk.prepareLight();
  chunk.updateState();
});

// TODO: combine place and remove
self.registerMessageHandler('TERRAIN_REMOVED_BLOCK', ({
  payload: {
    x, y, z, geoId,
  },
}) => {
  const chunk = terrain.chunks.get(geoId);
  if (!chunk) {
    return;
  }
  chunk.removeBlock(x, y, z);
  chunk.updateState();
  if ((x === 0) && (chunk.northChunk !== chunk)) {
    chunk.northChunk.calcVBO();
  } else if ((x === 15) && (chunk.southChunk !== chunk)) {
    chunk.southChunk.calcVBO();
  }
  if ((z === 0) && (chunk.westChunk !== chunk)) {
    chunk.westChunk.calcVBO();
  } else if ((z === 15) && (chunk.eastChunk !== chunk)) {
    chunk.eastChunk.calcVBO();
  }
  if (chunk.northChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.northChunk.updateState();
  }
  if (chunk.southChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.southChunk.updateState();
  }
  if (chunk.westChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.westChunk.updateState();
  }
  if (chunk.eastChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.eastChunk.updateState();
  }
});

self.registerMessageHandler('TERRAIN_PLACED_BLOCK', ({
  payload: {
    geoId, x, y, z, blockId, plane,
  },
}) => {
  const chunk = terrain.chunks.get(geoId);
  if (!chunk) {
    return;
  }
  chunk.putBlock(x, y, z, blockId, plane);

  chunk.light[x + z * 16 + y * 256] = chunk.light[x + z * 16 + y * 256] & 0x000F | 0xFD20;

  chunk.calcRecursionRed(x, y, z);
  chunk.calcRecursionGreen(x, y, z);
  chunk.calcRecursionBlue(x, y, z);

  chunk.updateState();
  if ((x === 0) && (chunk.northChunk !== chunk)) {
    chunk.northChunk.calcVBO();
  } else if ((x === 15) && (chunk.southChunk !== chunk)) {
    chunk.southChunk.calcVBO();
  }
  if ((z === 0) && (chunk.westChunk !== chunk)) {
    chunk.westChunk.calcVBO();
  } else if ((z === 15) && (chunk.eastChunk !== chunk)) {
    chunk.eastChunk.calcVBO();
  }
  if (chunk.northChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.northChunk.updateState();
  }
  if (chunk.southChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.southChunk.updateState();
  }
  if (chunk.westChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.westChunk.updateState();
  }
  if (chunk.eastChunk.state === CHUNK_STATUS_NEED_LOAD_VBO) {
    chunk.eastChunk.updateState();
  }
});

// eslint-disable-next-line
self.registerMessageHandler("TERRAIN_MIPMAP_LOADED", ({ payload }) => {
  // throw JSON.stringify(data);
  terrain.makeMipMappedTextureAtlas(payload.mipmap);
});
