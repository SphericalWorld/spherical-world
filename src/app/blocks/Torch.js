// @flow
import { mat4, vec3 } from 'gl-matrix';
import { getIndex } from '../../../common/chunk';
import model from '../../models/torch.json';
import { getLight } from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const getRotatedTourches = () => {
  const torches = [[], [], [], [], [], []];
  const vec = vec3.create();
  const vecTmp = vec3.create();

  torches[0] = model.vertexPositions;
  torches[1] = model.vertexPositions;
  for (let i = 0; i < model.vertexPositions.length / 3; i += 1) {
    vec[0] = model.vertexPositions[i * 3] - 0.5;
    vec[1] = model.vertexPositions[i * 3 + 1] - 0.5;
    vec[2] = model.vertexPositions[i * 3 + 2] - 0.5;

    let rMatr = mat4.create();
    mat4.rotateZ(rMatr, rMatr, 1.570796327 / 3);
    vec3.transformMat4(vecTmp, vec, rMatr);
    vecTmp[0] += 0.75;
    vecTmp[1] += 0.7;
    vecTmp[2] += 0.5;
    torches[2].push(vecTmp[0], vecTmp[1], vecTmp[2]);

    rMatr = mat4.create();
    mat4.rotateZ(rMatr, rMatr, -1.570796327 / 3);
    vec3.transformMat4(vecTmp, vec, rMatr);
    vecTmp[0] += 0.25;
    vecTmp[1] += 0.7;
    vecTmp[2] += 0.5;
    torches[3].push(vecTmp[0], vecTmp[1], vecTmp[2]);

    rMatr = mat4.create();
    mat4.rotateX(rMatr, rMatr, -1.570796327 / 3);
    vec3.transformMat4(vecTmp, vec, rMatr);
    vecTmp[0] += 0.5;
    vecTmp[1] += 0.7;
    vecTmp[2] += 0.75;
    torches[4].push(vecTmp[0], vecTmp[1], vecTmp[2]);

    rMatr = mat4.create();
    mat4.rotateX(rMatr, rMatr, 1.570796327 / 3);
    vec3.transformMat4(vecTmp, vec, rMatr);
    vecTmp[0] += 0.5;
    vecTmp[1] += 0.7;
    vecTmp[2] += 0.25;
    torches[5].push(vecTmp[0], vecTmp[1], vecTmp[2]);
  }
  return torches;
};

const Torch = () => {
  const torches = getRotatedTourches();
  return Object.assign(
    {},
    BasePropertiesComponent(),
    {
      id: 128,
      lightTransparent: true,
      sightTransparent: true,
      selfTransparent: false,
      needPhysics: false,

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
          vertexCount,
        },
      ) {
        const [r, g, b, sunlight] = getLight(chunk, x, y, z);
        const flag = chunk.flags[x + z * 16 + y * 256];

        for (let i = 0; i < model.vertexPositions.length / 3; i += 1) {
          vertexBuffer.push(
            torches[flag][i * 3] + x + chunk.x,
            torches[flag][i * 3 + 1] + y - 1,
            torches[flag][i * 3 + 2] + z + chunk.z,
          );
          colorBuffer.push(r, g, b);
          globalColorBuffer.push(sunlight);
          blockDataBuffer.push(this.id);
        }
        texCoordBuffer.push(...model.vertexTextureCoords);
        for (let i = 0; i < model.indices.length; i += 1) {
          indexBuffer.push(model.indices[i] + vertexCount);
        }
        return vertexCount + (model.vertexPositions.length / 3);
      },

      putBlock(chunk, x: number, y: number, z: number, value: number, plane: number) {
        const index = getIndex(x, y, z);
        chunk.blocksFlags[index] = this.getFlags(plane);
        chunk.blocks[index] = value;
        return true;
      },
    },
  );
};

export default Torch;
