import { getIndex } from '../../../common/chunk';
import type { MeshJSON } from '../../engine/Model/Model';
import type { RenderToChunk, ChunkData } from './BasePropertiesComponent';

type LightData = [number, number, number, number];

const calcLightLevels = (light: number): LightData => [
  0.8 ** (15 - ((light >>> 12) & 0xf)),
  0.8 ** (15 - ((light >>> 8) & 0xf)),
  0.8 ** (15 - ((light >>> 4) & 0xf)),
  0.8 ** ((15 - light) & 0xf),
];

export const getLight = (chunk: ChunkData, x: number, y: number, z: number): LightData =>
  calcLightLevels(chunk.light[getIndex(x, y, z)]);

const ModelComponent = (model: MeshJSON): { renderToChunk: RenderToChunk } => ({
  renderToChunk(
    chunk,
    x: number,
    y: number,
    z: number,
    { vertexBuffer, indexBuffer, vertexCount },
  ) {
    const [r, g, b, sunlight] = getLight(chunk, x, y, z);

    for (let i = 0; i < model.vertexPositions.length / 3; i += 1) {
      vertexBuffer.push(
        model.vertexPositions[i * 3] + x,
        model.vertexPositions[i * 3 + 1] + y,
        model.vertexPositions[i * 3 + 2] + z,
        model.vertexTextureCoords[i * 2],
        model.vertexTextureCoords[i * 2 + 1],
        this.id,
        r,
        g,
        b,
        sunlight,
      );
    }
    for (let i = 0; i < model.indices.length; i += 1) {
      indexBuffer.push(model.indices[i] + vertexCount);
    }
    return model.vertexPositions.length / 3;
  },
});

export default ModelComponent;
