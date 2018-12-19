// @flow strict
import {
  TERRAIN_MIPMAP_LOADED,
} from './terrainConstants';

export const loadTerrainMipmap = (mipmap) => (dispatch) => {
  dispatch({ type: TERRAIN_MIPMAP_LOADED, payload: { mipmap }, meta: { worker: true } });
};
