// @flow
import {
  TERRAIN_REMOVED_BLOCK,
  TERRAIN_PLACED_BLOCK,
  TERRAIN_MIPMAP_LOADED,
} from './terrainConstants';

export const loadTerrainMipmap = (mipmap) => dispatch => {
  dispatch({ type: TERRAIN_MIPMAP_LOADED, payload: { mipmap }, meta: { worker: true } });
};

export const terrainRemoveBlock = (geoId: string, playerId: number, x: number, y: number, z: number) => (dispatch, getState) => {
  const state = getState();
  dispatch({
    type: TERRAIN_REMOVED_BLOCK,
    payload: {
      geoId,
      x,
      y,
      z,
    },
    meta: {
      worker: true,
      api: playerId === state.players.mainPlayerId,
    },
  });
};

export const terrainPlaceBlock = ({
  geoId,
  x,
  y,
  z,
  blockId,
  plane,
}: {
  geoId: string,
  x: number,
  y: number,
  z: number,
  blockId: number,
  plane: number
}) => (dispatch, getState) => {
  dispatch({
    type: TERRAIN_PLACED_BLOCK,
    payload: {
      geoId,
      x,
      y,
      z,
      blockId,
      plane,
    },
    meta: {
      worker: true,
      api: true,
    },
  });
};
