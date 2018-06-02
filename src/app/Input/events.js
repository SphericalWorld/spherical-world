// @flow
// keep constants in integers to be able to use shared memory for input sync in the future

export type INPUT_TYPE = 0 | 1 | 2;
export const INPUT_TYPE_ACTION: 0 = 0;
export const INPUT_TYPE_STATE: 1 = 1;
export const INPUT_TYPE_RANGE: 2 = 2;

export const CAMERA_MOVE: 0 = 0;

export const RANGE_INPUTS: Set<number> = new Set([
  CAMERA_MOVE,
]);
