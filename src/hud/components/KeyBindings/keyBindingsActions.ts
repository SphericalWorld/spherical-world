import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import type { KeyPosition } from './keyBindingsTypes';
import { SET_KEY, KEY_EDITING_STARTED } from './keyBindingsConstants';

export const setKey = (action: string, firstKey?: string, secondKey?: string) => ({
  type: SET_KEY,
  payload: {
    action,
    firstKey,
    secondKey,
  },
});

export const startEditKey = (action: string, keyPosition: KeyPosition) => ({
  type: KEY_EDITING_STARTED,
  payload: {
    action,
    keyPosition,
  },
});

export const useStartEditKey = () => {
  const dispatch = useDispatch();
  return useCallback(
    (action: string, keyPosition: KeyPosition) => dispatch(startEditKey(action, keyPosition)),
    [dispatch],
  );
};
