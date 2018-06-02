// @flow
import { getGeoId } from '../../Terrain/Chunk/ChunkBase';
import { connect } from '../../util';
import { raytracerFinish } from './raytracerActions';

const mapState = (state) => {
  const { sight, worldPositionNear } = state.mouse;
  return {
    worldPositionNear,
    sight,
  };
};

const mapActions = () => ({
  raytracerFinish,
});

const raytracerProvider = (store, Chunk) => {
  @connect(mapState, mapActions, store)
  class RayTracer {
    plane: number;

    raytracerFinish: typeof raytracerFinish;

    constructor(terrain) {
      this.terrain = terrain;
      this.geoId = '';
      this.block = { x: 0, y: 0, z: 0 };
      this.blockInChunk = { x: 0, y: 0, z: 0 };
      this.emptyBlockChunkId = 0;
      this.emptyBlock = { x: 0, y: 0, z: 0 };
      this.emptyBlockInChunk = { x: 0, y: 0, z: 0 };
    }

    static getPlane(block, emptyBlock): number {
      let plane = 0;
      // top
      if (block.y < emptyBlock.y) {
        plane = 0;
        // bottom
      } else if (block.y > emptyBlock.y) {
        plane = 1;
        // north
      } else if (block.x > emptyBlock.x) {
        plane = 2;
        // south
      } else if (block.x < emptyBlock.x) {
        plane = 3;
        // east
      } else if (block.z > emptyBlock.z) {
        plane = 4;
        // west
      } else if (block.z < emptyBlock.z) {
        plane = 5;
      }
      return plane;
    }

    trace(position, sight) {
      const stepX = sight[0] ? sight[0] < 0 ? -1 : 1 : 0;
      const stepY = sight[1] ? sight[1] < 0 ? -1 : 1 : 0;
      const stepZ = sight[2] ? sight[2] < 0 ? -1 : 1 : 0;

      let x = Math.floor(position[0]);
      let y = Math.floor(position[1]);
      let z = Math.floor(position[2]);

      const tDeltaX = 1 / Math.abs(sight[0]);
      const tDeltaY = 1 / Math.abs(sight[1]);
      const tDeltaZ = 1 / Math.abs(sight[2]);

      let tMaxX;
      let tMaxY;
      let tMaxZ;

      if (position[0] >= 0) {
        if (stepX >= 0) {
          tMaxX = tDeltaX * (1 - (Math.abs(position[0]) - Math.floor(Math.abs(position[0]))));
        } else {
          tMaxX = tDeltaX * (1 - (Math.ceil(Math.abs(position[0])) - Math.abs(position[0])));
        }
      } else if (stepX >= 0) {
        tMaxX = tDeltaX * (1 - (Math.ceil(Math.abs(position[0])) - Math.abs(position[0])));
      } else {
        tMaxX = tDeltaX * (1 - (Math.abs(position[0]) - Math.floor(Math.abs(position[0]))));
      }

      if (stepY >= 0) {
        tMaxY = tDeltaY * (1 - (Math.abs(position[1]) - Math.floor(Math.abs(position[1]))));
      } else {
        tMaxY = tDeltaY * (1 - (Math.ceil(Math.abs(position[1])) - Math.abs(position[1])));
      }

      if (position[2] >= 0) {
        if (stepZ >= 0) {
          tMaxZ = tDeltaZ * (1 - (Math.abs(position[2]) - Math.floor(Math.abs(position[2]))));
        } else {
          tMaxZ = tDeltaZ * (1 - (Math.ceil(Math.abs(position[2])) - Math.abs(position[2])));
        }
      } else if (stepZ >= 0) {
        tMaxZ = tDeltaZ * (1 - (Math.ceil(Math.abs(position[2])) - Math.abs(position[2])));
      } else {
        tMaxZ = tDeltaZ * (1 - (Math.abs(position[2]) - Math.floor(Math.abs(position[2]))));
      }

      const calc = (x, y, z) => {
        const emptyBlock = { x, y, z };
        const chunk = this.terrain.chunks.get(getGeoId(Math.floor(x / 16) * 16, Math.floor(z / 16) * 16));
        if (!chunk) {
          return false;
        }
        if (x >= 0) {
          x %= 16;
        } else {
          x = 15 + (x + 1) % 16;
        }
        if (z >= 0) {
          z %= 16;
        } else {
          z = 15 + (z + 1) % 16;
        }
        if (chunk.getBlock(x, y + 1, z)) {
          this.geoId = chunk.geoId;
          this.blockInChunk = { x, y: y + 1, z };
          return true;
        }
        this.emptyBlockChunkId = chunk.geoId;
        this.emptyBlockInChunk = { x, y: y + 1, z };
        this.emptyBlock = emptyBlock;

        this.geoId = null;
        return false;
      };

      for (let i = 0; i < 5; i++) {
        if (tMaxX < tMaxZ) {
          if (tMaxX < tMaxY) {
            tMaxX += tDeltaX;
            x += stepX;
            if (calc(x, y, z)) {
              break;
            }
          } else {
            tMaxY += tDeltaY;
            y += stepY;
            if (calc(x, y, z)) {
              break;
            }
          }
        } else if (tMaxZ < tMaxY) {
          tMaxZ += tDeltaZ;
          z += stepZ;
          if (calc(x, y, z)) {
            break;
          }
        } else {
          tMaxY += tDeltaY;
          y += stepY;
          if (calc(x, y, z)) {
            break;
          }
        }
      }
      if (this.geoId === null) {
        this.emptyBlockChunkId = null;
      }
      this.block = { x, y, z };
      this.plane = RayTracer.getPlane(this.block, this.emptyBlock);
    }

    componentDidUpdate() {
      this.trace(this.worldPositionNear, this.sight);
      this.raytracerFinish(this);
    }
  }

  return RayTracer;
};

export default raytracerProvider;
