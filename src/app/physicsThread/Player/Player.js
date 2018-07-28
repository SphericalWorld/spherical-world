// @flow
const playerProvider = () => {
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

    constructor(params, terrain) {
      this.terrain = terrain;
      this.jumping = false;
      this.blockInDown = 0;
      this.blockInUp = 0;

      this.fallSpeed = 0;
      if (typeof (params) === 'object') {
        Object.assign(this, params);
      }
    }

    calcPhysics(delta) {
      let direction;
      if (this.fallSpeed >= 0) {
        direction = 1;
      } else {
        direction = -2;
      }
      let fall = !chunk.blocksFlags[chunk.getBlock(blockX, Math.floor(this.y) - direction, blockZ)][2];

      const { fallSpeedCap, acceleration } = chunk.blocksInfo[chunk.getBlock(blockX, Math.floor(this.y), blockZ)];

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

      blockX = Math.floor(this.x % 16);
      blockZ = Math.floor(this.z % 16);

      blockX = blockX >= 0 ? blockX : blockX + 16;
      blockZ = blockZ >= 0 ? blockZ : blockZ + 16;

      this.blockInDown = chunk.getBlock(blockX, Math.floor(this.y + 1), blockZ);
      this.blockInUp = chunk.getBlock(blockX, Math.floor(this.y + 2), blockZ);
    }

    putBlock(geoId, x, y, z, plane) {
      if (this.selectedItem.count > 0) {
        this.selectedItem.count -= 1;
        if (this.selectedItem.count === 0) {
          delete this.selectedItem;
        }
      }
    }
  }
  return Player;
};

export default playerProvider;
