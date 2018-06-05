// @flow
import { createReducer } from '../../../common/utils/reducerUtils';

import {
  CHUNK_VBO_LOADED,
} from './chunkConstants';

const initialState = {
  instances: {},
};

const onChunkVBOLoaded = (state, { geoId, buffers, buffersInfo }) => ({
  ...state,
  instances: {
    ...state.instances,
    [geoId]: {
      ...state.instances[geoId],
      buffers,
      buffersInfo,
    },
  },
});

export default createReducer(initialState, {
  [CHUNK_VBO_LOADED]: onChunkVBOLoaded,
});
