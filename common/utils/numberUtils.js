// @flow
export const clamp = (min: number, max: number) => (value: number): number => (value > max
  ? max
  : value < min
    ? min
    : value);
