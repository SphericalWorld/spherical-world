// @flow strict
import { getIndex } from '../../../common/chunk';
import { type MeshJSON } from '../../engine/Model/Model';
import { type RenderToChunk } from './BasePropertiesComponent';

const calcLightLevels = (light: number) => [
  0.8 ** (15 - ((light >>> 12) & 0xF)),
  0.8 ** (15 - ((light >>> 8) & 0xF)),
  0.8 ** (15 - ((light >>> 4) & 0xF)),
  0.8 ** (15 - light & 0xF),
];

export const getLight = (chunk, x: number, y: number, z: number) =>
  calcLightLevels(chunk.light[getIndex(x, y, z)]);

const ModelComponent = (model: MeshJSON): { renderToChunk: RenderToChunk} => ({
  renderToChunk(
    chunk,
    x: number,
    y: number,
    z: number,
    {
      vertexBuffer,
      indexBuffer,
      vertexCount,
    },
  ) {
    const [r, g, b, sunlight] = getLight(chunk, x, y, z);

    for (let i = 0; i < model.vertexPositions.length / 3; i += 1) {
      vertexBuffer.push(
        model.vertexPositions[i * 3] + x + chunk.x,
        model.vertexPositions[i * 3 + 1] + y,
        model.vertexPositions[i * 3 + 2] + z + chunk.z,
        model.vertexTextureCoords[i * 2],
        model.vertexTextureCoords[i * 2 + 1],
        this.id,
        r, g, b,
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
