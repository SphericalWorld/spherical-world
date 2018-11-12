// @flow strict
import { SET_KEY } from './keyBindingsConstants';

export const setKey = (key: string, action: string) => ({
  type: SET_KEY,
  payload: {
    key, action,
  },
});
