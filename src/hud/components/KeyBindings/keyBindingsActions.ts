import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import type { KeyPosition } from './keyBindingsTypes';
import { SET_KEY, KEY_EDITING_STARTED } from './keyBindingsConstants';
import { InputAction } from '../../../Input/InputAction';
import { Input } from '../../../Input';
import { KEY_SELECT_BUTTON } from '../../hudConstants';

export const setKey = (action: string, firstKey?: string, secondKey?: string) => ({
  type: SET_KEY,
  payload: {
    action,
    firstKey,
    secondKey,
  },
});

const startEditKey = (action: string, keyPosition: KeyPosition) => ({
  type: KEY_EDITING_STARTED,
  payload: {
    action,
    keyPosition,
  },
});

export const useStartEditKey = () => {
  const dispatch = useDispatch();
  return useCallback(
    (action: string, keyPosition: KeyPosition) => {
      dispatch(startEditKey(action, keyPosition));
      Input.waitForNewKey(action, (key: string) => {
        dispatch({ type: KEY_SELECT_BUTTON, payload: key });
      });
    },

    [dispatch],
  );
};
