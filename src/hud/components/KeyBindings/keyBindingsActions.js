// @flow strict
import type { KeyPosition } from './keyBindingsTypes';
import { SET_KEY, KEY_EDITING_STARTED } from './keyBindingsConstants';

export const setKey = (action: string, firstKey?: string, secondKey?: string) => ({
  type: SET_KEY,
  payload: {
    action, firstKey, secondKey,
  },
});

export const startEditKey = (action: string, key: KeyPosition) => ({
  type: KEY_EDITING_STARTED,
  payload: {
    action, key,
  },
});
