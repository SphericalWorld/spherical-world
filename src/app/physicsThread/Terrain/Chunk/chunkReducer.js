// @flow
import { createReducer } from '../../../../common/utils/reducerUtils';

import {
  CHUNK_LOADED,
} from './chunkConstants';

export type State = {
  +instances: {
    +[key: string]: {
      +x: number,
      +z: number
    }
  },
};

const initialState: State = {
  instances: {},
};

const onChunkLoaded = (state: State, {
  data, x, z, geoId,
}): State => ({
  ...state,
  instances: {
    ...state.instances,
    [geoId]: {
      data,
      x,
      z,
    },
  },
});

export default createReducer(initialState, {
  [CHUNK_LOADED]: onChunkLoaded,
});
