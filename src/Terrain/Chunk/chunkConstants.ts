export const CHUNK_STATUS_NEED_LOAD_ALL: 0 = 0;
export const CHUNK_STATUS_NEED_LOAD_LIGHT: 1 = 1;
export const CHUNK_STATUS_NEED_LOAD_VBO: 2 = 2;
export const CHUNK_STATUS_LOADED: 3 = 3;

export type ChunkState =
  | typeof CHUNK_STATUS_LOADED
  | typeof CHUNK_STATUS_NEED_LOAD_ALL
  | typeof CHUNK_STATUS_NEED_LOAD_LIGHT
  | typeof CHUNK_STATUS_NEED_LOAD_VBO;
