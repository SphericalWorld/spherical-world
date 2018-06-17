// @flow
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { Entity } from '../../ecs/Entity';
import type World from '../../ecs/World';
import { System } from '../../systems/System';
import Transform from '../../components/Transform';
import Raytracer from '../../components/Raytracer';
import UserControlled from '../../components/UserControlled';
import { getGeoId } from '../../../../common/chunk';

type Plane = 0 | 1 | 2 | 3 | 4 | 5;

const getPlane = (block, emptyBlock): Plane => {
  let plane = 0;
  // top
  if (block[1] < emptyBlock[1]) {
    plane = 0;
    // bottom
  } else if (block[1] > emptyBlock[1]) {
    plane = 1;
    // north
  } else if (block[0] > emptyBlock[0]) {
    plane = 2;
    // south
  } else if (block[0] < emptyBlock[0]) {
    plane = 3;
    // east
  } else if (block[2] > emptyBlock[2]) {
    plane = 4;
    // west
  } else if (block[2] < emptyBlock[2]) {
    plane = 5;
  }
  return plane;
};

const calc = (raytrace, x, y, z) => {
  const emptyBlock = [x, y, z];
  const chunk = raytrace.terrain.chunks.get(getGeoId(Math.floor(x / 16) * 16, Math.floor(z / 16) * 16));
  if (!chunk) {
    return false;
  }
  x = x >= 0
    ? x % 16
    : 15 + ((x + 1) % 16);

  z = z >= 0
    ? z % 16
    : 15 + ((z + 1) % 16);

  if (chunk.getBlock(x, y + 1, z)) {
    raytrace.geoId = chunk.geoId;
    raytrace.blockInChunk = { x, y: y + 1, z };
    return true;
  }
  raytrace.emptyBlockChunkId = chunk.geoId;
  raytrace.emptyBlockInChunk = { x, y: y + 1, z };
  raytrace.emptyBlock = emptyBlock;

  raytrace.geoId = null;
  return false;
};

const calcMax = (position: number, delta: number, step: number): number =>
  delta * (1 - (((position >= 0 && step >= 0) || (position < 0 && step < 0))
    ? Math.abs(position) - Math.floor(Math.abs(position))
    : Math.ceil(Math.abs(position)) - Math.abs(position)));

const raytraceProvider = (ecs: World, Chunk) => {
  class Raytrace implements System {
    components: {
      id: Entity,
      transform: Transform,
      raytracer: Raytracer,
    }[] = ecs.createSelector([Transform, Raytracer], [UserControlled]);
    userControlled: { transform: Transform }[] = ecs.createSelector([Transform, UserControlled]);

    mvMatrix: number[];
    pMatrix: number[];
    currentShader: WebGLProgram;

    plane: Plane = 0;
    geoId = '';
    block: Vec3 = vec3.create();
    blockInChunk = { x: 0, y: 0, z: 0 };
    emptyBlockChunkId = 0;
    emptyBlock: Vec3 = vec3.create();
    emptyBlockInChunk = { x: 0, y: 0, z: 0 };

    update(delta: number): Array {
      const result = [];
      for (const { id, transform } of this.components) {
        const userTransform = this.userControlled[0].transform;
        const v = vec3.fromValues(0, 1, 0);
        vec3.transformQuat(v, v, userTransform.rotation);

        const v2 = vec3.fromValues(1, 0, 0);
        vec3.transformQuat(v2, v2, userTransform.rotation);

        const v3 = vec3.fromValues(0, 0, 1);
        vec3.transformQuat(v3, v3, userTransform.rotation);

        this.trace(userTransform.translation, [-v2[2], -v[2], -v3[2]]);
        transform.translation[0] = this.block[0];
        transform.translation[1] = this.block[1];
        transform.translation[2] = this.block[2];
        result.push([id, transform]);
      }

      return result;
    }

    constructor(terrain) {
      this.terrain = terrain;
    }

    trace(position: Vec3, sight: Vec3) {
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
        if (calc(this, x, y, z)) {
          break;
        }
      }
      if (this.geoId === null) {
        this.emptyBlockChunkId = null;
      }
      this.block = [x, y, z];
      this.plane = getPlane(this.block, this.emptyBlock);
    }
  }

  return Raytrace;
};

export default raytraceProvider;
