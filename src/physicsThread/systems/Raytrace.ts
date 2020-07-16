import { vec3, vec2 } from 'gl-matrix';
import type { BlockFace } from '../../../common/block';
import type { BlockDetails } from '../../components/Raytracer';
import type { World } from '../../../common/ecs/World';
import type Terrain from '../Terrain/Terrain';
import type { System } from '../../../common/ecs/System';
import { toChunkPosition, toPositionInChunk } from '../../../common/chunk';
import Transform from '../../components/Transform';
import Raytracer from '../../components/Raytracer';
import UserControlled from '../../components/UserControlled';
import Camera from '../../components/Camera';

type RaytraceInfo = Readonly<{
  block: BlockDetails;
  emptyBlock?: BlockDetails;
  face?: BlockFace;
}>;

const getFace = (block: vec3, emptyBlock: vec3): BlockFace => {
  let face: BlockFace = 0;
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

const copyBlockDetais = (dest: BlockDetails, source: BlockDetails): void => {
  dest.block = source.block;
  vec2.copy(dest.coordinates, source.coordinates);
  vec3.copy(dest.position, source.position);
  vec3.copy(dest.positionInChunk, source.positionInChunk);
};

const getBlockDetails = (
  terrain: Terrain,
  x: number,
  y: number,
  z: number,
): BlockDetails | void => {
  const chunk = terrain.getChunk(toChunkPosition(x), toChunkPosition(z));
  if (chunk) {
    const position = vec3.fromValues(x, y, z);
    const xInChunk = toPositionInChunk(x);
    const zInChunk = toPositionInChunk(z);

    return {
      block: chunk.getBlock(xInChunk, y, zInChunk),
      position,
      coordinates: vec2.fromValues(chunk.x, chunk.z),
      positionInChunk: vec3.fromValues(xInChunk, y, zInChunk),
    };
  }
};

const calcMax = (position: number, delta: number, step: number): number =>
  delta *
  (1 -
    ((position >= 0 && step >= 0) || (position < 0 && step < 0)
      ? Math.abs(position) - Math.floor(Math.abs(position))
      : Math.ceil(Math.abs(position)) - Math.abs(position)));

export default (ecs: World, terrain: Terrain): System => {
  const components = ecs.createSelector([Transform, Raytracer]);
  const cameras = ecs.createSelector([UserControlled, Camera]);

  const trace = (position: vec3, sight: vec3): RaytraceInfo | void => {
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

    let blockDetails;
    let emptyBlockDetails;

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
      blockDetails = getBlockDetails(terrain, x, y, z);
      if (blockDetails && blockDetails.block) {
        break;
      }
    }
    if (!blockDetails) return;

    return emptyBlockDetails && blockDetails.block
      ? {
          block: blockDetails,
          emptyBlock: emptyBlockDetails,
          face: getFace(blockDetails.position, emptyBlockDetails.position),
        }
      : { block: blockDetails };
  };

  const raytrace = () => {
    for (const { transform, raytracer } of components) {
      const { camera } = cameras[0];
      const traceResult = trace(camera.worldPosition, camera.sight);
      if (traceResult) {
        raytracer.face = traceResult.face;
        raytracer.hasEmptyBlock = traceResult.emptyBlock ? 1 : 0;
        copyBlockDetais(raytracer.block, traceResult.block);
        if (raytracer.hasEmptyBlock) copyBlockDetais(raytracer.emptyBlock, traceResult.emptyBlock);
        vec3.copy(transform.translation, traceResult.block.position);
      }
    }
  };
  return raytrace;
};
