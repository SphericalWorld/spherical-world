// @flow
import { getGeoId } from '../../../../common/chunk';

import { CHUNK_STATUS_NEED_LOAD_ALL } from '../../Terrain/Chunk/chunkConstants';

const playerProvider = (store, Chunk, Inventory) => {
  class Player {
    id: number;
    x: number = 0.0;
    y: number = 0.0;
    z: number = 0.0;
    movingForward: boolean = false;
    movingBack: boolean = false;
    movingLeft: boolean = false;
    movingRight: boolean = false;
    running: boolean = false;

    static instances = [];

    constructor(params, terrain) {
      this.terrain = terrain;
      this.jumping = false;
      this.blockRemovingSpeed = 2;
      this.blockInDown = 0;
      this.blockInUp = 0;

      this.horizontalRotate = 0;
      this.verticalRotate = 0;
      this.fallSpeed = 0;
      if (typeof (params) === 'object') {
        Object.assign(this, params);
      }
    }

    calcPhysics(delta) {
      if (this.jumping && this.fallSpeed === 0) {
        this.fallSpeed = -0.007;
      }
      const chunk = this.terrain.chunks.get(getGeoId(Math.floor(this.x / 16) * 16, Math.floor(this.z / 16) * 16));
      if (!chunk || chunk.state === CHUNK_STATUS_NEED_LOAD_AL) {
        return;
      }

      let movingX = this.movingForward - this.movingBack;
      let movingZ = this.movingLeft - this.movingRight;
      const movingLength = (1 / (Math.sqrt(movingX * movingX + movingZ * movingZ) || 1));

      movingX *= movingLength;
      movingZ *= movingLength;

      // 1.570796327rad == 90*
      let deltaX = -delta * this.speed * (this.running + 1) * (Math.sin(this.horizontalRotate) * movingX + (Math.sin(this.horizontalRotate + 1.570796327)) * movingZ);
      let deltaZ = -delta * this.speed * (this.running + 1) * (Math.cos(this.horizontalRotate) * movingX + (Math.cos(this.horizontalRotate + 1.570796327)) * movingZ);


      let xInBlock = this.x - Math.floor(this.x);
      if (xInBlock < 0) {
        xInBlock += 1;
      }
      let zInBlock = this.z - Math.floor(this.z);
      if (zInBlock < 0) {
        zInBlock += 1;
      }

      let blockX = Math.floor(this.x % 16);
      let blockZ = Math.floor(this.z % 16);

      blockX = blockX >= 0 ? blockX : blockX + 16;
      blockZ = blockZ >= 0 ? blockZ : blockZ + 16;

      let direction;
      if (this.fallSpeed >= 0) {
        direction = 1;
      } else {
        direction = -2;
      }
      let fall = !chunk.blocksFlags[chunk.getBlock(blockX, Math.floor(this.y) - direction, blockZ)][2];

      const [fallSpeedCap, acceleration] = chunk.blocksInfo[chunk.getBlock(blockX, Math.floor(this.y), blockZ)];

      const testFall = (x, y, z) => !chunk.blocksInfo[chunk.at(x, y, z)][2];

      if (xInBlock >= 0.8) {
        fall = fall && testFall(blockX + 1, Math.floor(this.y) - direction, blockZ);
        if (zInBlock >= 0.8) {
          fall = fall && testFall(blockX + 1, Math.floor(this.y) - direction, blockZ + 1);
        } else if (zInBlock <= 0.2) {
          fall = fall && testFall(blockX + 1, Math.floor(this.y) - direction, blockZ - 1);
        }
      } else if (xInBlock <= 0.2) {
        fall = fall && testFall(blockX - 1, Math.floor(this.y) - direction, blockZ);
        if (zInBlock >= 0.8) {
          fall = fall && testFall(blockX - 1, Math.floor(this.y) - direction, blockZ + 1);
        } else if (zInBlock <= 0.2) {
          fall = fall && testFall(blockX - 1, Math.floor(this.y) - direction, blockZ - 1);
        }
      }

      if (zInBlock >= 0.8) {
        fall = fall && testFall(blockX, Math.floor(this.y) - direction, blockZ + 1);
      } else if (zInBlock <= 0.2) {
        fall = fall && testFall(blockX, Math.floor(this.y) - direction, blockZ - 1);
      }

      if (direction === 1) {
        fall = fall || ((this.y - Math.floor(this.y) - (this.fallSpeed + delta * 0.00002) * delta) > 0.1);
        if (fall) {
          this.fallSpeed += ((delta * acceleration));
          this.y -= this.fallSpeed * delta;
        } else if (this.fallSpeed > 0) {
          this.y = Math.floor(this.y) + 0.1;
          this.fallSpeed = 0;
          if (this.jumping) {
            this.fallSpeed = -0.007;
          }
        }
      } else {
        fall = fall || ((this.y - Math.floor(this.y) - (this.fallSpeed + delta * 0.00002) * delta) < 0.3);
        if (fall) {
          this.fallSpeed += ((delta * acceleration));
          this.y -= this.fallSpeed * delta;
        } else if (this.fallSpeed < 0) {
          this.fallSpeed = 0;
        }
      }
      if (fallSpeedCap) {
        if (this.fallSpeed > fallSpeedCap) {
          this.fallSpeed = fallSpeedCap;
        }
      }

      /** player height == 2 cubes, so we calculate twice */
      for (let i = 0; i < 2; i++) {
        if (deltaX > 0) {
          if (chunk.blocksFlags[chunk.at(blockX + 1, Math.floor(this.y) + i, blockZ)][2]) {
            if (xInBlock + deltaX >= 0.8) {
              deltaX = 0.79 - xInBlock;
            }
          }
        } else if (chunk.blocksFlags[chunk.at(blockX - 1, Math.floor(this.y) + i, blockZ)][2]) {
          if (xInBlock + deltaX <= 0.2) {
            deltaX = 0.21 - xInBlock;
          }
        }

        if (deltaZ > 0) {
          if (chunk.blocksFlags[chunk.at(blockX, Math.floor(this.y) + i, blockZ + 1)][2]) {
            if (zInBlock + deltaZ >= 0.8) {
              deltaZ = 0.79 - zInBlock;
            }
          }
        } else if (chunk.blocksFlags[chunk.at(blockX, Math.floor(this.y) + i, blockZ - 1)][2]) {
          if (zInBlock + deltaZ <= 0.2) {
            deltaZ = 0.21 - zInBlock;
          }
        }
      }

      if (this.speed !== 0) {
        this.x += deltaX;
        this.z += deltaZ;
      }

      blockX = Math.floor(this.x % 16);
      blockZ = Math.floor(this.z % 16);

      blockX = blockX >= 0 ? blockX : blockX + 16;
      blockZ = blockZ >= 0 ? blockZ : blockZ + 16;

      this.blockInDown = chunk.getBlock(blockX, Math.floor(this.y + 1), blockZ);
      this.blockInUp = chunk.getBlock(blockX, Math.floor(this.y + 2), blockZ);
    }

    putBlock(geoId, x, y, z, plane) {
      if (this.selectedItem.count > 0) {
        this.selectedItem.count--;
        if (this.selectedItem.count === 0) {
          delete this.selectedItem;
        }
      }
    }
  }
  return Player;
};

export default playerProvider;
