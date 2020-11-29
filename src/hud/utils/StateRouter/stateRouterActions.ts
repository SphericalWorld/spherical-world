import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { STATE_ROUTER_TOGGLE, STATE_ROUTER_SET } from './stateRouterConstants';

export const useToggleUIState = () => {
  const dispatch = useDispatch();
  return useCallback(
    (stateName: string) =>
      dispatch({
        type: STATE_ROUTER_TOGGLE,
        payload: { stateName },
      }),
    [dispatch],
  );
};

export const useSetUIState = () => {
  const dispatch = useDispatch();
  return useCallback(
    (stateName: string, value: boolean) =>
      dispatch({
        type: STATE_ROUTER_SET,
        payload: { stateName, value },
      }),
    [dispatch],
  );
};
