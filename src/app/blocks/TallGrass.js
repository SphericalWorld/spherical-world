// @flow
import Block from './Block';
import tallgrassModel from '../../models/tallgrass.json';

class TallGrass extends Block {
  id = 129;
  lightTransparent = true;
  sightTransparent = true;
  selfTransparent = false;
  needPhysics = false;
  buffer = {
    top: 1,
  };
  model = tallgrassModel;

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
    vertexCount
  ) {
    const [r, g, b, sunlight] = this.getLight(chunk, x, y, z);
    for (let i = 0; i < this.model.vertexPositions.length / 3; i++) {
      vertexPositions.push(this.model.vertexPositions[i * 3] + x + chunk.x, this.model.vertexPositions[i * 3 + 1] + y - 1, this.model.vertexPositions[i * 3 + 2] + z + chunk.z);
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
    return vertexCount + this.model.vertexPositions.length / 3;
  }

  putBlock(chunk, x, y, z, value, plane) {
    chunk.flags[x + z * 16 + y * 256] = this.getFlags(plane);
    if ((y !== 0) && (chunk.blocks[x + z * 16 + (y - 1) * 256] !== 128)) {
      chunk.blocks[x + z * 16 + y * 256] = value;
    }
  }
}

export default TallGrass;
