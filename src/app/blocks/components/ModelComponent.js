// @flow
import { getIndex } from '../../../../common/chunk';

const calcLightLevels = (light: number) => [
  0.8 ** (15 - ((light >>> 12) & 0xF)),
  0.8 ** (15 - ((light >>> 8) & 0xF)),
  0.8 ** (15 - ((light >>> 4) & 0xF)),
  0.8 ** (15 - light & 0xF),
];

export const getLight = (chunk, x: number, y: number, z: number) =>
  calcLightLevels(chunk.light[getIndex(x, y, z)]);

const ModelComponent = () => ({
  renderToChunk(
    chunk,
    x: number,
    y: number,
    z: number,
    {
      texCoordBuffer,
      vertexBuffer,
      indexBuffer,
      colorBuffer,
      globalColorBuffer,
      blockDataBuffer,
      vertexCount
    },
  ) {
    const [r, g, b, sunlight] = getLight(chunk, x, y, z);

    for (let i = 0; i < this.model.vertexPositions.length / 3; i += 1) {
      vertexBuffer.push(
        this.model.vertexPositions[i * 3] + x + chunk.x,
        this.model.vertexPositions[i * 3 + 1] + y - 1,
        this.model.vertexPositions[i * 3 + 2] + z + chunk.z
      );
      colorBuffer.push(r, g, b);
      globalColorBuffer.push(sunlight);
      blockDataBuffer.push(this.id);
    }
    texCoordBuffer.push(...this.model.vertexTextureCoords);
    for (let i = 0; i < this.model.indices.length; i += 1) {
      indexBuffer.push(this.model.indices[i] + vertexCount);
    }
    return vertexCount + (this.model.vertexPositions.length / 3);
  },
});

export default ModelComponent;
