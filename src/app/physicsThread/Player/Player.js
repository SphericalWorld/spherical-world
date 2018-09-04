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
  }
  return Player;
};

export default playerProvider;
