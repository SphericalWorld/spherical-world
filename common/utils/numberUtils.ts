import compose from '../fp/combinators/compose';

export const clamp = (min: number, max: number) => (value: number): number => (value > max
  ? max
  : value < min
    ? min
    : value);

export const toByte = compose(Math.floor)(clamp(0, 255));
