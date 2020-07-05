import ChunkBase from '../../../Terrain/Chunk/ChunkBase';

export default class Chunk extends ChunkBase {
  rainfallData = new Uint8Array(256);
  temperatureData = new Uint8Array(256);
}
