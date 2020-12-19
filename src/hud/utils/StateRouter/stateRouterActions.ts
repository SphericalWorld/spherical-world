import { useCallback } from 'react';
import { useRouterContext } from './StateRouter';

export const useToggleUIState = (): ((stateName: string) => void) => {
  const context = useRouterContext();
  return useCallback(
    (stateName) => context.setState((state) => ({ ...state, [stateName]: !state[stateName] })),
    [context],
  );
};

export const useSetUIState = (): ((stateName: string, value: boolean) => void) => {
  const context = useRouterContext();
  return useCallback(
    (stateName, value) => context.setState((state) => ({ ...state, [stateName]: value })),
    [context],
  );
};
