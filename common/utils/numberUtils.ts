export const clamp = (min: number, max: number) => (value: number): number =>
  value > max ? max : value < min ? min : value;

const clampByte = clamp(0, 255);

export const toByte = (value: number): number => Math.floor(clampByte(value));
