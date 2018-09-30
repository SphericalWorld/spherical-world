// @flow strict
export const THREAD_MAIN: 0 = 0;
export const THREAD_PHYSICS: 1 = 1;
export const THREAD_CHUNK_HANDLER: 2 = 2;

export type THREAD_ID =
  | typeof THREAD_MAIN
  | typeof THREAD_PHYSICS
  | typeof THREAD_CHUNK_HANDLER
