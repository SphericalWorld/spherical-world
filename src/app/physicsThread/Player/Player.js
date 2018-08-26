// @flow
const playerProvider = () => {
  class Player {
    id: number;
    x: number = 0.0;
    y: number = 0.0;
    z: number = 0.0;

    calcPhysics(delta) {
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
