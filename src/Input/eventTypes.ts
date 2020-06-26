import type { getElements } from '../../common/utils/flow';

// keep constants in integers to be able to use shared memory for input sync in the future
export const INPUT_TYPE_ACTION: 0 = 0;
export const INPUT_TYPE_STATE: 1 = 1;
export const INPUT_TYPE_RANGE: 2 = 2;

export const CATEGORY_MOVEMENT: 'Movement' = 'Movement';
export const CATEGORY_INTERFACE: 'Interface' = 'Interface';
export const CATEGORY_COMBAT_AND_BLOCKS: 'Combat & Blocks interaction' = 'Combat & Blocks interaction';

export const EVENT_CATEGORIES = [
  CATEGORY_MOVEMENT,
  CATEGORY_INTERFACE,
  CATEGORY_COMBAT_AND_BLOCKS,
];

export type INPUT_TYPE =
  | typeof INPUT_TYPE_ACTION
  | typeof INPUT_TYPE_STATE
  | typeof INPUT_TYPE_RANGE;

export type EVENT_CATEGORY = getElements<typeof EVENT_CATEGORIES>;
