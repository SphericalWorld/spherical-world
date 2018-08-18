// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { BlockFace } from '../../../../common/block';
import type { Maybe } from '../../../../common/fp/monads/maybe';
import type { BlockDetails } from '../../components/Raytracer';
import type World from '../../ecs/World';
import type { Terrain } from '../Terrain/Terrain';
import { Nothing } from '../../../../common/fp/monads/maybe';
import { System } from '../../systems/System';
import Transform from '../../components/Transform';
import Raytracer from '../../components/Raytracer';
import UserControlled from '../../components/UserControlled';
import Camera from '../../components/Camera';

type RaytraceInfo = {|
  +block: BlockDetails;
  +emptyBlock?: BlockDetails;
  +face?: BlockFace;
|};

const getFace = (block: Vec3, emptyBlock: Vec3): BlockFace => {
  let face = 0;
  if (block[1] < emptyBlock[1]) {
    face = 0; // top
  } else if (block[1] > emptyBlock[1]) {
    face = 1; // bottom
  } else if (block[0] > emptyBlock[0]) {
    face = 2; // north
  } else if (block[0] < emptyBlock[0]) {
    face = 3; // south
  } else if (block[2] > emptyBlock[2]) {
    face = 4; // east
  } else if (block[2] < emptyBlock[2]) {
    face = 5; // west
  }
  return face;
};

const getBlockDetails = (raytrace, x, y, z): Maybe<BlockDetails> => raytrace.terrain
  .getChunk(Math.floor(x / 16) * 16, Math.floor(z / 16) * 16)
  .map((chunk) => {
    const position = vec3.fromValues(x, y, z);
    x = x >= 0
      ? x % 16
      : 15 + ((x + 1) % 16);

    z = z >= 0
      ? z % 16
      : 15 + ((z + 1) % 16);

    return {
      block: chunk.getBlock(x, y + 1, z),
      position,
      geoId: chunk.geoId,
      positionInChunk: { x, y: y + 1, z },
    };
  });

const calcMax = (position: number, delta: number, step: number): number =>
  delta * (1 - (((position >= 0 && step >= 0) || (position < 0 && step < 0))
    ? Math.abs(position) - Math.floor(Math.abs(position))
    : Math.ceil(Math.abs(position)) - Math.abs(position)));

export default (ecs: World, Chunk) =>
  class Raytrace implements System {
    components = ecs.createSelector([Transform, Raytracer], [UserControlled]);
    userControlled = ecs.createSelector([Transform, UserControlled, Camera]);

    mvMatrix: number[];
    pMatrix: number[];
    currentShader: WebGLProgram;
    terrain: Terrain;

    update(): Array {
      const result = [];
      for (const { id, transform, raytracer } of this.components) {
        const { camera } = this.userControlled[0];
        this.trace(camera.worldPosition, camera.sight)
          .map((traceResult) => {
            raytracer.block = traceResult.block;
            raytracer.emptyBlock = traceResult.emptyBlock;

            vec3.copy(transform.translation, traceResult.block.position);
            result.push([id, transform, raytracer]);
          });
      }

      return result;
    }

    constructor(terrain) {
      this.terrain = terrain;
    }

    trace(position: Vec3, sight: Vec3): Maybe<RaytraceInfo> {
      const stepX = sight[0] < 0 ? -1 : 1;
      const stepY = sight[1] < 0 ? -1 : 1;
      const stepZ = sight[2] < 0 ? -1 : 1;

      let x = Math.floor(position[0]);
      let y = Math.floor(position[1]);
      let z = Math.floor(position[2]);

      const tDeltaX = 1 / Math.abs(sight[0]);
      const tDeltaY = 1 / Math.abs(sight[1]);
      const tDeltaZ = 1 / Math.abs(sight[2]);

      let tMaxX = calcMax(position[0], tDeltaX, stepX);
      let tMaxY = calcMax(position[1], tDeltaY, stepY);
      let tMaxZ = calcMax(position[2], tDeltaZ, stepZ);

      let blockDetails = Nothing;
      let emptyBlockDetails = Nothing;

      for (let i = 0; i < 5; i += 1) {
        if (tMaxX < tMaxZ) {
          if (tMaxX < tMaxY) {
            tMaxX += tDeltaX;
            x += stepX;
          } else {
            tMaxY += tDeltaY;
            y += stepY;
          }
        } else if (tMaxZ < tMaxY) {
          tMaxZ += tDeltaZ;
          z += stepZ;
        } else {
          tMaxY += tDeltaY;
          y += stepY;
        }
        emptyBlockDetails = blockDetails;
        blockDetails = getBlockDetails(this, x, y, z);
        if (blockDetails.isJust === true && blockDetails.extract().block) {
          break;
        }
      }
      return blockDetails.map(block => (emptyBlockDetails.isJust === true
        ? {
          block,
          emptyBlock: emptyBlockDetails.extract(),
          face: getFace(block.position, emptyBlockDetails.extract().position),
        }
        : { block }));
    }
  };
