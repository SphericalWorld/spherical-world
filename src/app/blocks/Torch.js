// @flow
import { mat4, vec3 } from 'gl-matrix';
import Block from './Block';
import torchModel from '../../models/torch.json';

class Torch extends Block {
  id = 128;
  lightTransparent = true;
  sightTransparent = true;
  selfTransparent = false;
  needPhysics = false;
  buffer = {
    top: 0,
  };
  model = torchModel;

  constructor() {
    super();
    this.setModel();
  }

  setModel() {
    this.torches = [[], [], [], [], [], []];
    const vec = [0.0, 0.0, 0.0];
    const vecTmp = [0.0, 0.0, 0.0];

    this.torches[0] = this.model.vertexPositions;
    this.torches[1] = this.model.vertexPositions;
    for (let i = 0; i < this.model.vertexPositions.length / 3; i++) {
      vec[0] = this.model.vertexPositions[i * 3] - 0.5;
      vec[1] = this.model.vertexPositions[i * 3 + 1] - 0.5;
      vec[2] = this.model.vertexPositions[i * 3 + 2] - 0.5;

      let rMatr = mat4.create();
      mat4.rotateZ(rMatr, rMatr, 1.570796327 / 3);
      vec3.transformMat4(vecTmp, vec, rMatr);
      vecTmp[0] += 0.75;
      vecTmp[1] += 0.7;
      vecTmp[2] += 0.5;
      this.torches[2].push(vecTmp[0], vecTmp[1], vecTmp[2]);

      rMatr = mat4.create();
      mat4.rotateZ(rMatr, rMatr, -1.570796327 / 3);
      vec3.transformMat4(vecTmp, vec, rMatr);
      vecTmp[0] += 0.25;
      vecTmp[1] += 0.7;
      vecTmp[2] += 0.5;
      this.torches[3].push(vecTmp[0], vecTmp[1], vecTmp[2]);

      rMatr = mat4.create();
      mat4.rotateX(rMatr, rMatr, -1.570796327 / 3);
      vec3.transformMat4(vecTmp, vec, rMatr);
      vecTmp[0] += 0.5;
      vecTmp[1] += 0.7;
      vecTmp[2] += 0.75;
      this.torches[4].push(vecTmp[0], vecTmp[1], vecTmp[2]);

      rMatr = mat4.create();
      mat4.rotateX(rMatr, rMatr, 1.570796327 / 3);
      vec3.transformMat4(vecTmp, vec, rMatr);
      vecTmp[0] += 0.5;
      vecTmp[1] += 0.7;
      vecTmp[2] += 0.25;
      this.torches[5].push(vecTmp[0], vecTmp[1], vecTmp[2]);
    }
  }

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
    const flag = chunk.flags[x + z * 16 + y * 256];
    for (let i = 0; i < this.model.vertexPositions.length / 3; i++) {
      vertexPositions.push(this.torches[flag][i * 3] + x + chunk.x, this.torches[flag][i * 3 + 1] + y - 1, this.torches[flag][i * 3 + 2] + z + chunk.z);
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
    chunk.blocks[x + z * 16 + y * 256] = value;
    return true;
  }
}

export default Torch;
