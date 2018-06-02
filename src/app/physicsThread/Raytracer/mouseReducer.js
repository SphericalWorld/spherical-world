// @flow
import { createReducer } from '../../../common/utils/reducerUtils';
import {
  MOUSE_MOVED,
} from '../../mouse/mouseConstants';

const initialState = {
  worldPosition: [],
};

function onMouseMoved(state, payload) {
  return {
    ...state,
    ...payload,
  };
}

export default createReducer(initialState, {
  [MOUSE_MOVED]: onMouseMoved,
});
