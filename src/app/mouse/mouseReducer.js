// @flow
import { createReducer } from '../../common/utils/reducerUtils';

import {
  MOUSE_MOVED,
  MOUSE_BUTTON_PRESSED,
  MOUSE_BUTTON_RELEASED,
  MOUSE_BUTTON_LEFT,
  MOUSE_BUTTON_MIDDLE,
  MOUSE_BUTTON_RIGHT,
  MOUSE_LOCK_CHANGED,
} from './mouseConstants';

const initialState = {
  buttons: {
    [MOUSE_BUTTON_LEFT]: false,
    [MOUSE_BUTTON_MIDDLE]: false,
    [MOUSE_BUTTON_RIGHT]: false,
  },
  worldPosition: [],
  locked: false,
};

const onMouseMoved = (state, payload) => ({
  ...state,
  ...payload,
});

const onMousePress = (state, payload) => ({
  ...state,
  buttons: {
    ...state.buttons,
    ...payload,
  },
});

const onMouseRelease = (state, payload) => ({
  ...state,
  buttons: {
    ...state.buttons,
    ...payload,
  },
});

const onMouseLockChanged = (state, { locked }) => ({
  ...state,
  locked,
});

export default createReducer(initialState, {
  [MOUSE_MOVED]: onMouseMoved,
  [MOUSE_BUTTON_PRESSED]: onMousePress,
  [MOUSE_BUTTON_RELEASED]: onMouseRelease,
  [MOUSE_LOCK_CHANGED]: onMouseLockChanged,
});
