// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { BlockFace } from '../../../../common/block';
import type { Maybe } from '../../../../common/fp/monads/maybe';
import type { BlockDetails } from '../../components/Raytracer';
import type World from '../../../../common/ecs/World';
import type { Terrain } from '../Terrain/Terrain';
import { toChunkPosition, toPositionInChunk } from '../../../../common/chunk';
import { Nothing } from '../../../../common/fp/monads/maybe';
import { System } from '../../../../common/ecs/System';
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
  .getChunk(toChunkPosition(x), toChunkPosition(z))
  .map((chunk) => {
    const position = vec3.fromValues(x, y, z);
    x = toPositionInChunk(x);
    z = toPositionInChunk(z);

    return {
      block: chunk.getBlock(x, y, z),
      position,
      geoId: chunk.geoId,
      positionInChunk: { x, y, z },
    };
  });

const calcMax = (position: number, delta: number, step: number): number =>
  delta * (1 - (((position >= 0 && step >= 0) || (position < 0 && step < 0))
    ? Math.abs(position) - Math.floor(Math.abs(position))
    : Math.ceil(Math.abs(position)) - Math.abs(position)));

export default (ecs: World, terrain: Terrain) =>
  class Raytrace implements System {
    components = ecs.createSelector([Transform, Raytracer]);
    cameras = ecs.createSelector([UserControlled, Camera]);

    mvMatrix: number[];
    pMatrix: number[];
    currentShader: WebGLProgram;
    terrain: Terrain;

    update(): Array {
      const result = [];
      for (const { id, transform, raytracer } of this.components) {
        const { camera } = this.cameras[0];
        this.trace(camera.worldPosition, camera.sight)
          .map((traceResult) => {
            raytracer.block = traceResult.block;
            raytracer.emptyBlock = traceResult.emptyBlock;
            raytracer.face = traceResult.face;
            vec3.copy(transform.translation, traceResult.block.position);
            result.push([id, transform, raytracer]);
          });
      }

      return result;
    }

    constructor() {
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
      return blockDetails.map(block => (emptyBlockDetails.isJust === true && block.block
        ? {
          block,
          emptyBlock: emptyBlockDetails.extract(),
          face: getFace(block.position, emptyBlockDetails.extract().position),
        }
        : { block }));
    }
  };
