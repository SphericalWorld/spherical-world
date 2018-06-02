// @flow
class Block {
  fallSpeedCap = 0;
  fallAcceleration = 0.00002;

  textures = {};

  getLight(chunk, x: number, y: number, z: number) {
    const light = chunk.light[x + (z * 16) + (y * 256)];
    const r = Math.pow(0.8, 15 - ((light >>> 12) & 0xF));
    const g = Math.pow(0.8, 15 - ((light >>> 8) & 0xF));
    const b = Math.pow(0.8, 15 - ((light >>> 4) & 0xF));
    const sunlight = Math.pow(0.8, 15 - light & 0xF);
    return [
      r, g, b, sunlight,
    ];
  }

  getFlags(plane) {
    return plane;
  }
}

export default Block;
