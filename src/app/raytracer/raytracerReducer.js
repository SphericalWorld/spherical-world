// @flow
import { createReducer } from '../../common/utils/reducerUtils';

import {
  TRACE_FINISHED,
} from './raytracerConstants';

const initialState = {
  block: {},
  blockInChunk: {},
};

function finishTrace(state, payload) {
  return {
    ...state,
    ...payload,
  };
}

export default createReducer(initialState, {
  [TRACE_FINISHED]: finishTrace,
});
