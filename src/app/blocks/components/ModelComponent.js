// @flow
import { getIndex } from '../../../../common/chunk';

export const getLight = (chunk, x: number, y: number, z: number) => {
  const light = chunk.light[getIndex(x, y, z)];
  const r = 0.8 ** (15 - ((light >>> 12) & 0xF));
  const g = 0.8 ** (15 - ((light >>> 8) & 0xF));
  const b = 0.8 ** (15 - ((light >>> 4) & 0xF));
  const sunlight = 0.8 ** (15 - light & 0xF);
  return [
    r, g, b, sunlight,
  ];
};

const ModelComponent = () => ({
  renderToChunk(
    chunk,
    x: number,
    y: number,
    z: number,
    vertexTextureCoords,
    vertexPositions,
    indicesData,
    colorData,
    globalColorData,
    blockData,
    vertexCount,
  ) {
    const [r, g, b, sunlight] = getLight(chunk, x, y, z);

    for (let i = 0; i < this.model.vertexPositions.length / 3; i++) {
      vertexPositions.push(
        this.model.vertexPositions[i * 3] + x + chunk.x,
        this.model.vertexPositions[i * 3 + 1] + y - 1,
        this.model.vertexPositions[i * 3 + 2] + z + chunk.z
      );
      colorData.push(r, g, b);
      globalColorData.push(sunlight);
      blockData.push(this.id);
    }

    for (let i = 0; i < this.model.vertexTextureCoords.length; i++) {
      vertexTextureCoords.push(this.model.vertexTextureCoords[i]);
    }
    for (let i = 0; i < this.model.indices.length; i++) {
      indicesData.push(this.model.indices[i] + vertexCount);
    }
    return vertexCount + (this.model.vertexPositions.length / 3);
  },
});

export default ModelComponent;
