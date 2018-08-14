// @flow
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
  let chunk = terrain.getChunk(data.x, data.z);
  if (chunk.isJust === false) {
    chunk = terrain.addChunk(new Chunk(terrain, data.x, data.z));
  } else {
    chunk = chunk.extract();
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
